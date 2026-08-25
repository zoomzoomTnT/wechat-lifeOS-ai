-- Life OS — single SQLite file for memos / finance / fridge / stocks
-- Default path: ~/.openclaw/workspace/data/life.db
-- Backup: python3 scripts/life.py backup ~/backup/life-YYYYMMDD.db
-- Money is INTEGER cents. Timestamps are ISO-8601 UTC unless noted.
-- Do not set journal_mode here — life.py sets WAL after connect.

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY,
  handle TEXT UNIQUE,                 -- WeChat / OpenClaw peer id
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' -- owner | member | guest
    CHECK (role IN ('owner', 'member', 'guest')),
  timezone TEXT NOT NULL DEFAULT 'Asia/Tokyo',
  locale TEXT NOT NULL DEFAULT 'zh-CN',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS merchants (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  name_norm TEXT NOT NULL,            -- lowercase, no spaces, for match
  aliases_json TEXT NOT NULL DEFAULT '[]',
  kind TEXT NOT NULL DEFAULT 'other'  -- supermarket | restaurant | cafe | market | other
    CHECK (kind IN ('supermarket', 'restaurant', 'cafe', 'market', 'other')),
  location_tag TEXT NOT NULL DEFAULT 'other' -- home_nearby | office_nearby | other
    CHECK (location_tag IN ('home_nearby', 'office_nearby', 'other')),
  address TEXT,
  favorite_score REAL NOT NULL DEFAULT 0, -- -2..2, updated from feedback
  last_visit_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_merchants_name_norm ON merchants(name_norm);

CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY,
  payer_id INTEGER NOT NULL REFERENCES people(id),
  merchant_id INTEGER REFERENCES merchants(id),
  purchased_at TEXT,                  -- local wall time as ISO, see timezone
  timezone TEXT NOT NULL DEFAULT 'Asia/Tokyo',
  currency TEXT NOT NULL DEFAULT 'CNY',
  subtotal_cents INTEGER,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  computed_total_cents INTEGER,       -- sum(line items)
  total_match INTEGER,                -- 1 / 0 / NULL (unknown)
  image_path TEXT,
  barcode TEXT,                       -- 票面条码 / 流水号 / 订单号
  printed_at TEXT,                    -- 票面打印时间（墙上时间，原样）
  fingerprint TEXT,                   -- barcode|printed_at，无条码则 merchant|printed_at|total
  status TEXT NOT NULL DEFAULT 'pending_confirm'
    CHECK (status IN ('pending_confirm', 'confirmed', 'rejected', 'duplicate')),
  duplicate_of INTEGER REFERENCES receipts(id),
  raw_ocr_json TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_receipts_fingerprint
  ON receipts(fingerprint) WHERE fingerprint IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_receipts_barcode_printed
  ON receipts(barcode, printed_at)
  WHERE barcode IS NOT NULL AND printed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_receipts_payer ON receipts(payer_id, purchased_at);

-- Same physical ticket claimed by another person (household share / de-dupe)
CREATE TABLE IF NOT EXISTS receipt_claims (
  receipt_id INTEGER NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  person_id INTEGER NOT NULL REFERENCES people(id),
  role TEXT NOT NULL DEFAULT 'viewer' -- payer | split | viewer
    CHECK (role IN ('payer', 'split', 'viewer')),
  share_cents INTEGER,
  PRIMARY KEY (receipt_id, person_id)
);

CREATE TABLE IF NOT EXISTS receipt_items (
  id INTEGER PRIMARY KEY,
  receipt_id INTEGER NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  line_no INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 1,
  unit TEXT,
  unit_price_cents INTEGER,
  amount_cents INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  is_food INTEGER NOT NULL DEFAULT 0,
  fridge_item_id INTEGER,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt ON receipt_items(receipt_id);

CREATE TABLE IF NOT EXISTS food_knowledge (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  name_norm TEXT NOT NULL UNIQUE,
  aliases_json TEXT NOT NULL DEFAULT '[]',
  category TEXT NOT NULL              -- veg | fruit | meat | seafood | dairy | drink | leftover | staple | other
    CHECK (category IN ('veg','fruit','meat','seafood','dairy','drink','leftover','staple','other')),
  fridge_days INTEGER,
  freezer_days INTEGER,
  pantry_days INTEGER,
  default_location TEXT NOT NULL DEFAULT 'fridge'
    CHECK (default_location IN ('fridge','freezer','pantry','counter')),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS fridge_items (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES people(id),
  added_by_id INTEGER NOT NULL REFERENCES people(id),
  receipt_item_id INTEGER REFERENCES receipt_items(id),
  name TEXT NOT NULL,
  name_norm TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('veg','fruit','meat','seafood','dairy','drink','leftover','staple','other')),
  qty REAL,
  unit TEXT,
  location TEXT NOT NULL DEFAULT 'fridge'
    CHECK (location IN ('fridge','freezer','pantry','counter')),
  purchased_at TEXT,
  expires_at TEXT,                    -- UTC ISO
  status TEXT NOT NULL DEFAULT 'in_stock'
    CHECK (status IN ('in_stock','eaten','discarded','expired','gifted')),
  preference INTEGER CHECK (preference BETWEEN 1 AND 5),
  repurchase TEXT CHECK (repurchase IN ('yes','no','maybe') OR repurchase IS NULL),
  last_reminded_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fridge_open ON fridge_items(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_fridge_name ON fridge_items(name_norm, owner_id);

CREATE TABLE IF NOT EXISTS food_prefs (
  person_id INTEGER NOT NULL REFERENCES people(id),
  name_norm TEXT NOT NULL,
  preference INTEGER CHECK (preference BETWEEN 1 AND 5),
  repurchase TEXT CHECK (repurchase IN ('yes','no','maybe') OR repurchase IS NULL),
  notes TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (person_id, name_norm)
);

CREATE TABLE IF NOT EXISTS memos (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES people(id),
  title TEXT NOT NULL,
  body TEXT,
  kind TEXT NOT NULL DEFAULT 'reminder'
    CHECK (kind IN ('reminder','followup','expiry','options','restock','brief','custom')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','snoozed','done','cancelled')),
  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  due_at TEXT,                        -- UTC ISO; NULL = unscheduled
  timezone TEXT NOT NULL DEFAULT 'Asia/Tokyo',
  cron_expr TEXT,                     -- 5-field cron if recurring
  cron_tz TEXT,                       -- IANA tz for cron_expr
  automation_id TEXT,                 -- OpenClaw automations job id
  source_domain TEXT,                 -- finance | fridge | stocks | manual
  source_table TEXT,
  source_id INTEGER,
  payload_json TEXT,
  last_fired_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_memos_due ON memos(status, due_at);
CREATE INDEX IF NOT EXISTS idx_memos_auto ON memos(automation_id);

CREATE TABLE IF NOT EXISTS holdings (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES people(id),
  symbol TEXT NOT NULL,
  market TEXT NOT NULL DEFAULT 'US'   -- US | HK | CN
    CHECK (market IN ('US','HK','CN')),
  name TEXT,
  qty REAL NOT NULL DEFAULT 0,
  avg_cost REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (owner_id, symbol, market)
);

CREATE TABLE IF NOT EXISTS stock_events (
  id INTEGER PRIMARY KEY,
  holding_id INTEGER NOT NULL REFERENCES holdings(id) ON DELETE CASCADE,
  kind TEXT NOT NULL                  -- earnings | options_expiry | dividend | alert | note
    CHECK (kind IN ('earnings','options_expiry','dividend','alert','note')),
  due_at TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  memo_id INTEGER REFERENCES memos(id),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  domain TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id INTEGER REFERENCES people(id),
  entity_type TEXT,
  entity_id INTEGER,
  detail_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(created_at);

-- Seed: owner placeholder (agent upserts real WeChat handle on first run)
INSERT OR IGNORE INTO people (id, handle, display_name, role, timezone)
VALUES (1, 'owner', '主人', 'owner', 'Asia/Tokyo');
