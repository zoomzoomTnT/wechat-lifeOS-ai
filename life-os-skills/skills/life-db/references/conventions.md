# Conventions

## Money

Store integer **cents**. `128.50 CNY` → `12850`. Display: divide by 100, keep 2 dp.

## Time

- Columns `*_at` are UTC ISO-8601 with `Z`.
- `timezone` / `cron_tz` are IANA names (`Asia/Shanghai`, `America/New_York`).
- Options expiry "Friday 8:25 ET" → `cron_expr` `25 8 * * 5` + `cron_tz=America/New_York`. Convert to the user's local zone only when speaking.

## Identity

`people.handle` = OpenClaw WeChat peer id (stable). Display names change; handles should not.

Expense **归属** = `receipts.payer_id`. Household viewing / split = `receipt_claims`.

## Dedup

Receipt fingerprint = sha256(`name_norm|YYYY-MM-DD|total_cents|sha256[:16]`)[:32].

If fingerprint or `image_sha256` hits an existing confirmed/pending row:

- Do **not** insert a second ticket.
- `INSERT` a `receipt_claims` row for the new person if needed.
- Tell the user it is the same 小票.

## Enums (keep in sync with schema CHECKs)

- people.role: `owner | member | guest`
- merchants.kind: `supermarket | restaurant | cafe | market | other`
- merchants.location_tag: `home_nearby | office_nearby | other`
- receipts.status: `pending_confirm | confirmed | rejected | duplicate`
- fridge status: `in_stock | eaten | discarded | expired | gifted`
- fridge location: `fridge | freezer | pantry | counter`
- memo kind: `reminder | followup | expiry | options | restock | brief | custom`
- memo status: `open | snoozed | done | cancelled`
- food category: `veg | fruit | meat | seafood | dairy | drink | leftover | staple | other`

## name_norm

Lowercase, strip spaces and punctuation. Chinese names stay Chinese (`生菜` → `生菜`). Use `food_knowledge.name_norm` and `aliases_json` for matching.

## Don't

- Don't create a second `.db` per domain.
- Don't store raw card numbers or payment QR payloads.
- Don't auto-`confirmed` a receipt whose line items don't sum to `total_cents` (±2 cents).
- Don't mark fridge `eaten` without a user confirmation on expiry day.
