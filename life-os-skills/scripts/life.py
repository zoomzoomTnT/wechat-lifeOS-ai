#!/usr/bin/env python3
"""Life OS SQLite kernel. JSON on stdout (always flushed). Exits in ≤8s."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import signal
import sqlite3
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None  # type: ignore

HERE = Path(__file__).resolve().parent
SKILL_ROOT = HERE.parent
SCHEMA = SKILL_ROOT / "schema.sql"
FOOD = HERE / "food_knowledge.sql"

# OpenClaw exec captures a pipe. Never block on stdin; always flush JSON.
try:
    sys.stdin.close()
except Exception:
    pass
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True, encoding="utf-8")
    sys.stderr.reconfigure(line_buffering=True, encoding="utf-8")
os.environ.setdefault("PYTHONUNBUFFERED", "1")


def default_db() -> Path:
    env = (os.environ.get("LIFE_DB") or "").strip()
    if env:
        return Path(env).expanduser()
    ws = (
        os.environ.get("OPENCLAW_WORKSPACE_DIR")
        or os.environ.get("OPENCLAW_WORKSPACE")
        or ""
    ).strip()
    if ws:
        return Path(ws).expanduser() / "data" / "life.db"
    return Path.home() / ".openclaw" / "workspace" / "data" / "life.db"


def pragma(con: sqlite3.Connection, sql: str) -> None:
    cur = con.execute(sql)
    try:
        cur.fetchall()
    finally:
        cur.close()


def connect(db: Path) -> sqlite3.Connection:
    db.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(db), timeout=2)
    con.row_factory = sqlite3.Row
    pragma(con, "PRAGMA busy_timeout = 2000")
    pragma(con, "PRAGMA foreign_keys = ON")
    return con


def out(obj) -> None:
    json.dump(obj, sys.stdout, ensure_ascii=False, indent=2, default=str)
    sys.stdout.write("\n")
    sys.stdout.flush()


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def now_utc_s() -> str:
    return now_utc().strftime("%Y-%m-%dT%H:%M:%SZ")


def has_table(con: sqlite3.Connection, name: str) -> bool:
    row = con.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (name,)
    ).fetchone()
    return row is not None


def table_columns(con: sqlite3.Connection, table: str) -> set[str]:
    return {r["name"] for r in con.execute(f"PRAGMA table_info({table})")}


def init_db(con: sqlite3.Connection) -> dict:
    sql = SCHEMA.read_text(encoding="utf-8")
    # journal_mode inside executescript can stall; strip it.
    lines = [
        ln
        for ln in sql.splitlines()
        if "journal_mode" not in ln.lower()
    ]
    con.executescript("\n".join(lines) + "\n")
    if FOOD.exists():
        con.executescript(FOOD.read_text(encoding="utf-8"))
    migrate(con)
    n = con.execute("SELECT COUNT(*) AS c FROM food_knowledge").fetchone()["c"]
    return {"ok": True, "action": "init", "schema": 2, "food_knowledge": n}


def migrate(con: sqlite3.Connection) -> None:
    if not has_table(con, "receipts"):
        return
    cols = table_columns(con, "receipts")
    if "barcode" not in cols:
        con.execute("ALTER TABLE receipts ADD COLUMN barcode TEXT")
    if "printed_at" not in cols:
        con.execute("ALTER TABLE receipts ADD COLUMN printed_at TEXT")
    con.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS idx_receipts_barcode_printed
        ON receipts(barcode, printed_at)
        WHERE barcode IS NOT NULL AND printed_at IS NOT NULL
        """
    )
    con.execute("INSERT OR IGNORE INTO schema_migrations(version) VALUES (1)")
    con.execute("INSERT OR IGNORE INTO schema_migrations(version) VALUES (2)")
    con.commit()


def ensure(con: sqlite3.Connection) -> dict:
    if has_table(con, "fridge_items") and has_table(con, "food_knowledge"):
        migrate(con)
        n = con.execute("SELECT COUNT(*) AS c FROM food_knowledge").fetchone()["c"]
        if n == 0 and FOOD.exists():
            con.executescript(FOOD.read_text(encoding="utf-8"))
            n = con.execute("SELECT COUNT(*) AS c FROM food_knowledge").fetchone()["c"]
        return {"ok": True, "action": "ensure", "already": True, "food_knowledge": n}
    return init_db(con)


def maybe_schema(con: sqlite3.Connection, fn):
    """Run fn. Only create/migrate schema if a table or column is missing."""
    try:
        return fn()
    except sqlite3.OperationalError as exc:
        msg = str(exc).lower()
        if "no such table" in msg or "no such column" in msg:
            ensure(con)
            return fn()
        raise


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
    return {"ok": True, "rowcount": cur.rowcount, "lastrowid": cur.lastrowid}


def due(con: sqlite3.Connection, within_hours: float) -> dict:
    rows = [
        dict(r)
        for r in con.execute(
            """
            SELECT m.*, p.display_name AS owner_name, p.timezone AS owner_tz
            FROM memos m
            JOIN people p ON p.id = m.owner_id
            WHERE m.status = 'open'
              AND m.due_at IS NOT NULL
              AND datetime(m.due_at) <= datetime('now', ?)
            ORDER BY m.priority ASC, m.due_at ASC
            """,
            (f"+{within_hours} hours",),
        ).fetchall()
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
        "generated_at": now_utc_s(),
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
    return {"ok": True, "backup": str(dest), "bytes": dest.stat().st_size}


def fingerprint(
    barcode: str | None = None,
    printed_at: str | None = None,
    name_norm: str | None = None,
    total_cents: int | None = None,
) -> str:
    stamp = (printed_at or "").strip()
    code = (barcode or "").strip()
    if code and stamp:
        raw = f"{code}|{stamp}"
    else:
        raw = f"{(name_norm or '').strip()}|{stamp}|{total_cents or 0}"
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


def lookup_food(con: sqlite3.Connection, name: str) -> dict | None:
    needle = name.strip()
    row = con.execute(
        "SELECT * FROM food_knowledge WHERE name = ? OR name_norm = ?",
        (needle, needle),
    ).fetchone()
    if row:
        return dict(row)
    rows = con.execute("SELECT * FROM food_knowledge").fetchall()
    for r in rows:
        d = dict(r)
        aliases = []
        try:
            aliases = json.loads(d.get("aliases_json") or "[]")
        except json.JSONDecodeError:
            pass
        if needle.lower() in [a.lower() for a in aliases]:
            return d
        if needle in (d.get("name") or "") or needle in (d.get("name_norm") or ""):
            return d
    return None


def local_18(day: datetime, tz_name: str) -> datetime:
    if ZoneInfo is None:
        return day.replace(hour=9, minute=0, second=0, microsecond=0)
    tz = ZoneInfo(tz_name)
    local_day = day.astimezone(tz)
    target = local_day.replace(hour=18, minute=0, second=0, microsecond=0)
    return target.astimezone(timezone.utc)


def fridge_add(
    con: sqlite3.Connection,
    *,
    name: str,
    qty: float,
    owner_id: int,
    added_by_id: int,
    location: str | None,
    days: int | None,
    unit: str | None,
    cut: bool,
) -> dict:
    food = lookup_food(con, name)
    name_norm = (food["name_norm"] if food else name.strip())
    category = food["category"] if food else "other"
    loc = location or (food["default_location"] if food else "fridge")
    if loc not in ("fridge", "freezer", "pantry", "counter"):
        loc = "fridge"
    if days is None:
        if loc == "freezer" and food and food.get("freezer_days"):
            days = int(food["freezer_days"])
        elif loc == "pantry" and food and food.get("pantry_days"):
            days = int(food["pantry_days"])
        elif food and food.get("fridge_days") is not None:
            days = int(food["fridge_days"])
        else:
            days = 3 if loc == "fridge" else None
    if cut and (days is None or days > 3):
        days = 3
        loc = "fridge"

    owner = con.execute("SELECT * FROM people WHERE id=?", (owner_id,)).fetchone()
    if not owner:
        raise SystemExit(f"unknown owner_id {owner_id}")
    tz_name = owner["timezone"] or "Asia/Tokyo"

    purchased = now_utc()
    expires = None
    if days is not None:
        expires = purchased + timedelta(days=days)
    expires_s = expires.strftime("%Y-%m-%dT%H:%M:%SZ") if expires else None

    cur = con.execute(
        """
        INSERT INTO fridge_items (
          owner_id, added_by_id, name, name_norm, category, qty, unit,
          location, purchased_at, expires_at, status
        ) VALUES (?,?,?,?,?,?,?,?,?,?, 'in_stock')
        """,
        (
            owner_id,
            added_by_id,
            food["name"] if food else name.strip(),
            name_norm,
            category,
            qty,
            unit,
            loc,
            purchased.strftime("%Y-%m-%dT%H:%M:%SZ"),
            expires_s,
        ),
    )
    item_id = cur.lastrowid
    memos = []
    if expires is not None:
        expiry_local = local_18(expires, tz_name)
        title = f"{name_norm} 今天到期"
        body = f"冰箱里的{name_norm}今天该处理了。吃完了还是扔了？"
        cur = con.execute(
            """
            INSERT INTO memos (
              owner_id, title, body, kind, status, priority,
              due_at, timezone, source_domain, source_table, source_id
            ) VALUES (?, ?, ?, 'expiry', 'open', 3, ?, ?, 'fridge', 'fridge_items', ?)
            """,
            (owner_id, title, body, expiry_local.strftime("%Y-%m-%dT%H:%M:%SZ"), tz_name, item_id),
        )
        memos.append({"id": cur.lastrowid, "when": "expiry_day", "due_at": expiry_local.strftime("%Y-%m-%dT%H:%M:%SZ")})
        if days is not None and days >= 2:
            warn = local_18(expires - timedelta(days=2), tz_name)
            cur = con.execute(
                """
                INSERT INTO memos (
                  owner_id, title, body, kind, status, priority,
                  due_at, timezone, source_domain, source_table, source_id
                ) VALUES (?, ?, ?, 'expiry', 'open', 3, ?, ?, 'fridge', 'fridge_items', ?)
                """,
                (
                    owner_id,
                    f"{name_norm} 两天后到期",
                    f"冰箱里的{name_norm}快要过期了。这两天吃掉？",
                    warn.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    tz_name,
                    item_id,
                ),
            )
            memos.append({"id": cur.lastrowid, "when": "t_minus_2", "due_at": warn.strftime("%Y-%m-%dT%H:%M:%SZ")})
    con.execute(
        """
        INSERT INTO events (domain, action, actor_id, entity_type, entity_id, detail_json)
        VALUES ('fridge', 'add', ?, 'fridge_items', ?, ?)
        """,
        (added_by_id, item_id, json.dumps({"name": name_norm, "days": days}, ensure_ascii=False)),
    )
    con.commit()
    item = dict(con.execute("SELECT * FROM fridge_items WHERE id=?", (item_id,)).fetchone())
    return {
        "ok": True,
        "action": "fridge-add",
        "item": item,
        "knowledge": food,
        "memos": memos,
        "note": "expiry memos are picked up by heartbeat (life.py due); no OpenClaw cron required",
    }


def fridge_list(con: sqlite3.Connection, status: str) -> dict:
    rows = [
        dict(r)
        for r in con.execute(
            """
            SELECT * FROM fridge_items
            WHERE status = ?
            ORDER BY COALESCE(expires_at, '9999') ASC, id DESC
            """,
            (status,),
        ).fetchall()
    ]
    return {"ok": True, "rows": rows, "count": len(rows)}


def resolve_db(raw: str | None) -> Path:
    if raw and raw.strip() and raw.strip() not in ("$LIFE_DB", "${LIFE_DB}"):
        return Path(raw.strip()).expanduser()
    return default_db()


def inbox_dir(db: Path) -> Path:
    env = (os.environ.get("LIFE_INBOX") or "").strip()
    if env:
        return Path(env).expanduser()
    return db.parent / "life-inbox"


def run_job(db: Path, job: dict) -> dict:
    if not isinstance(job, dict):
        return {"ok": False, "error": "job must be a JSON object"}
    op = (job.get("op") or job.get("action") or "").strip()
    con = connect(db)
    try:
        if op in ("fridge-add", "fridge_add", "add"):
            name = (job.get("name") or job.get("item") or "").strip()
            if not name:
                return {"ok": False, "error": "fridge-add needs name"}
            return maybe_schema(
                con,
                lambda: fridge_add(
                    con,
                    name=name,
                    qty=float(job.get("qty") or 1),
                    owner_id=int(job.get("owner_id") or 1),
                    added_by_id=int(job.get("added_by_id") or job.get("owner_id") or 1),
                    location=job.get("location"),
                    days=int(job["days"]) if job.get("days") is not None else None,
                    unit=job.get("unit"),
                    cut=bool(job.get("cut")),
                ),
            )
        if op in ("fridge-list", "fridge_list", "list"):
            return maybe_schema(con, lambda: fridge_list(con, job.get("status") or "in_stock"))
        if op == "due":
            return maybe_schema(con, lambda: due(con, float(job.get("within_hours") or 36)))
        if op in ("query", "sql-query"):
            return maybe_schema(
                con, lambda: query(con, job.get("sql") or "", job.get("params") or [])
            )
        if op in ("exec", "sql-exec"):
            return maybe_schema(
                con, lambda: execute(con, job.get("sql") or "", job.get("params") or [])
            )
        if op in ("memo-add", "memo_add"):
            title = (job.get("title") or "").strip()
            if not title:
                return {"ok": False, "error": "memo-add needs title"}

            def _memo():
                cur = con.execute(
                    """
                    INSERT INTO memos (
                      owner_id, title, body, kind, status, due_at, timezone, cron_expr, cron_tz
                    ) VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?)
                    """,
                    (
                        int(job.get("owner_id") or 1),
                        title,
                        job.get("body"),
                        job.get("kind") or "reminder",
                        job.get("due_at"),
                        job.get("tz") or "Asia/Tokyo",
                        job.get("cron"),
                        job.get("cron_tz") or job.get("tz"),
                    ),
                )
                con.commit()
                row = dict(con.execute("SELECT * FROM memos WHERE id=?", (cur.lastrowid,)).fetchone())
                return {"ok": True, "action": "memo-add", "memo": row, "summary": f"已记备忘：{title}"}

            return maybe_schema(con, _memo)
        return {"ok": False, "error": f"unknown op {op}"}
    finally:
        con.close()


def drain_inbox(db: Path) -> dict:
    folder = inbox_dir(db)
    folder.mkdir(parents=True, exist_ok=True)
    applied = []
    for path in sorted(folder.glob("*.json")):
        if path.name.endswith(".result.json"):
            continue
        result_path = path.with_name(path.stem + ".result.json")
        if result_path.exists():
            continue
        try:
            job = json.loads(path.read_text(encoding="utf-8"))
            result = run_job(db, job)
        except Exception as exc:
            result = {"ok": False, "error": str(exc)}
        result_path.write_text(
            json.dumps(result, ensure_ascii=False, indent=2, default=str) + "\n",
            encoding="utf-8",
        )
        applied.append({"job": str(path), "ok": result.get("ok"), "result": str(result_path)})
    return {"ok": True, "applied": applied, "count": len(applied), "inbox": str(folder)}


def serve(db: Path, host: str, port: int) -> int:
    import threading
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
    from urllib.parse import parse_qs, unquote, urlparse

    folder = inbox_dir(db)
    folder.mkdir(parents=True, exist_ok=True)
    lock = threading.Lock()

    def handle(job: dict) -> dict:
        with lock:
            return run_job(db, job)

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt, *args):
            sys.stderr.write("life-http: " + (fmt % args) + "\n")

        def _send(self, code: int, obj: dict):
            raw = json.dumps(obj, ensure_ascii=False, indent=2, default=str).encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)

        def do_GET(self):
            u = urlparse(self.path)
            q = {k: v[-1] for k, v in parse_qs(u.query).items()}
            path = unquote(u.path)
            if path in ("/", "/health"):
                self._send(
                    200,
                    {
                        "ok": True,
                        "db": str(db),
                        "inbox": str(folder),
                        "listen": f"http://{host}:{port}",
                    },
                )
                return
            if path == "/fridge-add":
                self._send(200, handle({"op": "fridge-add", **q}))
                return
            if path == "/fridge-list":
                self._send(200, handle({"op": "fridge-list", **q}))
                return
            if path == "/due":
                self._send(200, handle({"op": "due", **q}))
                return
            self._send(404, {"ok": False, "error": f"no {path}"})

        def do_POST(self):
            n = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(n) if n else b"{}"
            try:
                job = json.loads(raw.decode("utf-8") or "{}")
            except json.JSONDecodeError as exc:
                self._send(400, {"ok": False, "error": f"json: {exc}"})
                return
            if urlparse(self.path).path in ("/fridge-add", "/job", "/"):
                if "op" not in job:
                    job["op"] = "fridge-add"
                self._send(200, handle(job))
                return
            self._send(404, {"ok": False, "error": "POST /job"})

    stop = threading.Event()

    def watch():
        while not stop.is_set():
            try:
                with lock:
                    drain_inbox(db)
            except Exception as exc:
                sys.stderr.write(f"life-http inbox: {exc}\n")
            stop.wait(0.25)

    threading.Thread(target=watch, daemon=True).start()
    httpd = ThreadingHTTPServer((host, port), Handler)
    banner = {
        "ok": True,
        "action": "serve",
        "listen": f"http://{host}:{port}",
        "inbox": str(folder),
        "db": str(db),
        "hint": "agent should WRITE inbox/*.json (no exec). GET /fridge-add?name=...",
    }
    out(banner)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        stop.set()
        httpd.server_close()
    return 0


def main() -> int:
    p = argparse.ArgumentParser(prog="life.py")
    p.add_argument("--db", default=None)
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("init")
    sub.add_parser("ensure")
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
    fp.add_argument("--barcode", default="")
    fp.add_argument("--printed-at", default="")
    fp.add_argument("--name-norm", default="")
    fp.add_argument("--total-cents", type=int, default=0)

    look = sub.add_parser("lookup-receipt")
    look.add_argument("--barcode", default="")
    look.add_argument("--printed-at", default="")
    look.add_argument("--fingerprint", default="")

    fa = sub.add_parser("fridge-add")
    fa.add_argument("--name", required=True)
    fa.add_argument("--qty", type=float, default=1)
    fa.add_argument("--unit", default=None)
    fa.add_argument("--location", default=None)
    fa.add_argument("--days", type=int, default=None)
    fa.add_argument("--owner-id", type=int, default=1)
    fa.add_argument("--added-by-id", type=int, default=1)
    fa.add_argument("--cut", action="store_true", help="cut fruit/veg; force fridge 3 days")

    fl = sub.add_parser("fridge-list")
    fl.add_argument("--status", default="in_stock")

    sub.add_parser("drain-inbox")
    srv = sub.add_parser("serve")
    srv.add_argument("--host", default="127.0.0.1")
    srv.add_argument("--port", type=int, default=int(os.environ.get("LIFE_HTTP_PORT") or 8788))

    args = p.parse_args()
    db = resolve_db(args.db)

    if args.cmd == "serve":
        return serve(db, args.host, args.port)

    if args.cmd != "backup" and hasattr(signal, "SIGALRM"):
        def _timeout(signum, frame):
            raise TimeoutError("life.py exceeded 8s")

        signal.signal(signal.SIGALRM, _timeout)
        signal.alarm(8)

    if args.cmd == "path":
        out({"ok": True, "db": str(db), "exists": db.exists(), "script": str(Path(__file__).resolve())})
        return 0

    if args.cmd == "fingerprint":
        out(
            {
                "ok": True,
                "fingerprint": fingerprint(
                    barcode=args.barcode,
                    printed_at=args.printed_at,
                    name_norm=args.name_norm,
                    total_cents=args.total_cents,
                ),
                "mode": "barcode"
                if args.barcode.strip() and args.printed_at.strip()
                else "fallback",
            }
        )
        return 0

    if args.cmd == "drain-inbox":
        out(drain_inbox(db))
        return 0

    con = connect(db)
    try:
        if args.cmd in ("init", "ensure"):
            out(ensure(con))
        elif args.cmd == "query":
            out(maybe_schema(con, lambda: query(con, args.sql, parse_params(args.params))))
        elif args.cmd == "exec":
            out(maybe_schema(con, lambda: execute(con, args.sql, parse_params(args.params))))
        elif args.cmd == "due":
            out(maybe_schema(con, lambda: due(con, args.within_hours)))
        elif args.cmd == "lookup-receipt":
            def _lookup():
                fpv = args.fingerprint.strip()
                if not fpv:
                    fpv = fingerprint(args.barcode, args.printed_at)
                rows = [
                    dict(r)
                    for r in con.execute(
                        """
                        SELECT * FROM receipts
                        WHERE fingerprint = ?
                           OR (barcode = ? AND printed_at = ? AND ? != '')
                        ORDER BY id DESC
                        """,
                        (
                            fpv,
                            args.barcode.strip(),
                            args.printed_at.strip(),
                            args.barcode.strip(),
                        ),
                    ).fetchall()
                ]
                return {"ok": True, "fingerprint": fpv, "rows": rows, "count": len(rows)}

            out(maybe_schema(con, _lookup))
        elif args.cmd == "fridge-add":
            out(
                maybe_schema(
                    con,
                    lambda: fridge_add(
                        con,
                        name=args.name,
                        qty=args.qty,
                        owner_id=args.owner_id,
                        added_by_id=args.added_by_id,
                        location=args.location,
                        days=args.days,
                        unit=args.unit,
                        cut=args.cut,
                    ),
                )
            )
        elif args.cmd == "fridge-list":
            out(maybe_schema(con, lambda: fridge_list(con, args.status)))
        elif args.cmd == "backup":
            out(backup(con, Path(args.dest).expanduser()))
        else:
            raise SystemExit(f"unknown cmd {args.cmd}")
    finally:
        if hasattr(signal, "SIGALRM"):
            signal.alarm(0)
        con.close()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except sqlite3.Error as exc:
        out({"ok": False, "error": f"sqlite: {exc}"})
        raise SystemExit(1)
    except TimeoutError as exc:
        out({"ok": False, "error": str(exc)})
        raise SystemExit(2)
    except BrokenPipeError:
        raise SystemExit(0)
