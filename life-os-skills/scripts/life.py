#!/usr/bin/env python3
"""Life OS SQLite kernel. JSON on stdout, diagnostics on stderr."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
SKILL_ROOT = HERE.parent
SCHEMA = SKILL_ROOT / "schema.sql"
FOOD = HERE / "food_knowledge.sql"


def default_db() -> Path:
    env = os.environ.get("LIFE_DB")
    if env:
        return Path(env).expanduser()
    ws = os.environ.get("OPENCLAW_WORKSPACE_DIR") or os.environ.get(
        "OPENCLAW_WORKSPACE", ""
    )
    if ws:
        return Path(ws).expanduser() / "data" / "life.db"
    return Path.home() / ".openclaw" / "workspace" / "data" / "life.db"


def connect(db: Path) -> sqlite3.Connection:
    db.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(db), timeout=10)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    con.execute("PRAGMA journal_mode = WAL")
    con.execute("PRAGMA busy_timeout = 5000")
    return con


def out(obj) -> None:
    json.dump(obj, sys.stdout, ensure_ascii=False, indent=2, default=str)
    sys.stdout.write("\n")


def now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def init_db(con: sqlite3.Connection) -> dict:
    con.executescript(SCHEMA.read_text(encoding="utf-8"))
    if FOOD.exists():
        con.executescript(FOOD.read_text(encoding="utf-8"))
    con.execute(
        "INSERT OR IGNORE INTO schema_migrations(version) VALUES (1)"
    )
    con.commit()
    n = con.execute("SELECT COUNT(*) AS c FROM food_knowledge").fetchone()["c"]
    return {"ok": True, "action": "init", "food_knowledge": n}


def query(con: sqlite3.Connection, sql: str, params) -> dict:
    stripped = sql.strip().rstrip(";")
    if ";" in stripped:
        raise SystemExit("query allows a single statement only")
    cur = con.execute(sql, params)
    rows = [dict(r) for r in cur.fetchall()]
    return {"ok": True, "rows": rows, "count": len(rows)}


def execute(con: sqlite3.Connection, sql: str, params) -> dict:
    cur = con.execute(sql, params)
    con.commit()
    return {
        "ok": True,
        "rowcount": cur.rowcount,
        "lastrowid": cur.lastrowid,
    }


def due(con: sqlite3.Connection, within_hours: float) -> dict:
    sql = """
    SELECT m.*, p.display_name AS owner_name, p.timezone AS owner_tz
    FROM memos m
    JOIN people p ON p.id = m.owner_id
    WHERE m.status = 'open'
      AND m.due_at IS NOT NULL
      AND datetime(m.due_at) <= datetime('now', ?)
    ORDER BY m.priority ASC, m.due_at ASC
    """
    rows = [
        dict(r)
        for r in con.execute(sql, (f"+{within_hours} hours",)).fetchall()
    ]
    fridge = [
        dict(r)
        for r in con.execute(
            """
            SELECT f.*, p.display_name AS owner_name
            FROM fridge_items f
            JOIN people p ON p.id = f.owner_id
            WHERE f.status = 'in_stock'
              AND f.expires_at IS NOT NULL
              AND datetime(f.expires_at) <= datetime('now', '+2 days')
            ORDER BY f.expires_at ASC
            """
        ).fetchall()
    ]
    pending = [
        dict(r)
        for r in con.execute(
            """
            SELECT id, payer_id, total_cents, status, created_at, image_path
            FROM receipts
            WHERE status = 'pending_confirm'
            ORDER BY created_at DESC
            LIMIT 10
            """
        ).fetchall()
    ]
    return {
        "ok": True,
        "generated_at": now_utc(),
        "memos_due": rows,
        "fridge_expiring": fridge,
        "receipts_pending": pending,
    }


def backup(con: sqlite3.Connection, dest: Path) -> dict:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.unlink(missing_ok=True)
    b = sqlite3.connect(str(dest))
    try:
        con.backup(b)
    finally:
        b.close()
    return {
        "ok": True,
        "backup": str(dest),
        "bytes": dest.stat().st_size,
    }


def fingerprint(name_norm: str, date: str | None, total_cents: int, sha: str | None) -> str:
    day = (date or "")[:10]
    prefix = (sha or "")[:16]
    raw = f"{name_norm}|{day}|{total_cents}|{prefix}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:32]


def parse_params(raw: str | None):
    if not raw:
        return []
    data = json.loads(raw)
    if isinstance(data, dict):
        return data
    if isinstance(data, list):
        return data
    raise SystemExit("--params must be a JSON array or object")


def main() -> int:
    p = argparse.ArgumentParser(prog="life.py")
    p.add_argument("--db", default=str(default_db()))
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("init")
    sub.add_parser("path")

    q = sub.add_parser("query")
    q.add_argument("sql")
    q.add_argument("--params", default=None)

    e = sub.add_parser("exec")
    e.add_argument("sql")
    e.add_argument("--params", default=None)

    d = sub.add_parser("due")
    d.add_argument("--within-hours", type=float, default=36)

    b = sub.add_parser("backup")
    b.add_argument("dest")

    fp = sub.add_parser("fingerprint")
    fp.add_argument("--name-norm", required=True)
    fp.add_argument("--date", default="")
    fp.add_argument("--total-cents", type=int, required=True)
    fp.add_argument("--sha", default="")

    args = p.parse_args()
    db = Path(args.db).expanduser()

    if args.cmd == "path":
        out({"ok": True, "db": str(db), "exists": db.exists()})
        return 0

    if args.cmd == "fingerprint":
        out(
            {
                "ok": True,
                "fingerprint": fingerprint(
                    args.name_norm, args.date, args.total_cents, args.sha
                ),
            }
        )
        return 0

    con = connect(db)
    try:
        if args.cmd == "init":
            out(init_db(con))
        elif args.cmd == "query":
            out(query(con, args.sql, parse_params(args.params)))
        elif args.cmd == "exec":
            out(execute(con, args.sql, parse_params(args.params)))
        elif args.cmd == "due":
            if not db.exists() or db.stat().st_size == 0:
                init_db(con)
            out(due(con, args.within_hours))
        elif args.cmd == "backup":
            out(backup(con, Path(args.dest).expanduser()))
        else:
            raise SystemExit(f"unknown cmd {args.cmd}")
    finally:
        con.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
