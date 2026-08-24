export const SKILLS = [
  {
    id: "life-db",
    name: "life-db",
    title: "内核",
    blurb: "一个 SQLite 文件、一套 CLI、所有表的约定。",
    triggers: "初始化、备份、SQL、任何生活数据写入",
    loads: "读写 life.db 之前",
  },
  {
    id: "life-finance",
    name: "life-finance",
    title: "记账",
    blurb: "微信小票看图分录、对总价、归属、去重、熟店。",
    triggers: "小票、记账、花了、盒马、超市、饭店",
    loads: "发图片或说花钱时",
  },
  {
    id: "life-fridge",
    name: "life-fridge",
    title: "冰箱",
    blurb: "食品入柜、保质期常识、过期备忘、喜爱与再买。",
    triggers: "冰箱、过期、蔬菜水果肉、冰茶、吃完了",
    loads: "食品相关，或记账确认后的食品行",
  },
  {
    id: "life-memos",
    name: "life-memos",
    title: "备忘",
    blurb: "提醒总线。精确 cron 与一次性到期都从这里挂上。",
    triggers: "提醒我、到期、期权、cron、完成了、推迟",
    loads: "任何需要主动找你的后续",
  },
  {
    id: "life-stocks",
    name: "life-stocks",
    title: "持仓",
    blurb: "试用：登记持仓与事件，把期权到期写成循环 memo。",
    triggers: "股票、持仓、期权到期、财报、ticker",
    loads: "谈组合或期权时",
  },
  {
    id: "life-proactive",
    name: "life-proactive",
    title: "主动开口",
    blurb: "心跳与 cron 叫醒后：查 due、决定开口还是 HEARTBEAT_OK。",
    triggers: "heartbeat、巡检、主动提醒、automation 醒来",
    loads: "被调度叫醒时",
  },
] as const;

export const TABLES = [
  {
    name: "people",
    role: "谁在用",
    cols: [
      ["handle", "微信 / OpenClaw peer id"],
      ["display_name", "称呼"],
      ["role", "owner | member | guest"],
      ["timezone", "默认 Asia/Shanghai"],
    ],
  },
  {
    name: "receipts",
    role: "一张小票",
    cols: [
      ["payer_id", "开销归属，不是谁拍的"],
      ["total_cents", "底部总价，整数分"],
      ["computed_total_cents", "行项目加总"],
      ["fingerprint / image_sha256", "跨用户去重"],
      ["status", "pending_confirm → confirmed"],
    ],
  },
  {
    name: "receipt_items",
    role: "小票行",
    cols: [
      ["name / qty / amount_cents", "分录"],
      ["is_food", "是否提议进冰箱"],
      ["fridge_item_id", "转入后回写"],
    ],
  },
  {
    name: "receipt_claims",
    role: "同一张票的其他人",
    cols: [
      ["person_id + role", "payer | split | viewer"],
      ["share_cents", "分摊（可空）"],
    ],
  },
  {
    name: "merchants",
    role: "熟店",
    cols: [
      ["location_tag", "home_nearby | office_nearby | other"],
      ["favorite_score", "−2..2，口碑"],
      ["kind", "supermarket / restaurant / …"],
    ],
  },
  {
    name: "fridge_items",
    role: "柜里的东西",
    cols: [
      ["owner_id / added_by_id", "主人 vs 放入者"],
      ["expires_at", "UTC"],
      ["status", "in_stock / eaten / discarded / …"],
      ["preference / repurchase", "这一次 + 长期印象在 food_prefs"],
    ],
  },
  {
    name: "food_knowledge",
    role: "保质期常识",
    cols: [
      ["name_norm / aliases", "生菜、鸡胸、冰茶…"],
      ["fridge_days", "叶菜 2 天、生肉 2 天"],
      ["default_location", "fridge | freezer | pantry | counter"],
    ],
  },
  {
    name: "memos",
    role: "主动对话的唯一出口",
    cols: [
      ["due_at / cron_expr + cron_tz", "一次性或循环"],
      ["automation_id", "OpenClaw job"],
      ["source_domain / source_id", "挂回冰箱或持仓"],
      ["last_fired_at", "6 小时内不重复"],
    ],
  },
  {
    name: "holdings / stock_events",
    role: "试用持仓",
    cols: [
      ["symbol + market", "US | HK | CN"],
      ["kind", "options_expiry / earnings / …"],
      ["memo_id", "连到提醒"],
    ],
  },
] as const;

export const FLOWS = [
  {
    id: "receipt",
    title: "小票 → 入账 → 冰箱 → 过期提醒",
    steps: [
      "微信发照片。finance 技能看图，抽出商家、行项目、底部总价。",
      "行项目加总，与底部比，容差 ±2 分。对不上就停，不 confirmed。",
      "fingerprint / 图片哈希去重。别人传过同一张 → 加 claim，不建第二张票。",
      "以 pending_confirm 入库，把清单发回微信。你回「对」。",
      "食品行按 food_knowledge 提议进冰箱（叶菜 2 天、鸡胸 2 天…）。",
      "同意后写 fridge_items，并挂两条 memo：过期前 2 天、过期当天。",
      "memos 技能创建 OpenClaw automation，到期用微信问你吃完还是扔了。",
    ],
  },
  {
    id: "options",
    title: "美东周五 8:25 期权到期",
    steps: [
      "你说：按美东时间每周五 8:25 提醒我期权到期。",
      "stocks 写 stock_events；memos 写循环备忘 cron_expr=25 8 * * 5，cron_tz=America/New_York。",
      "创建 automation：--channel openclaw-weixin --tz America/New_York --session isolated --announce。",
      "到点后 isolated session 读 proactive 技能，查持仓，用一句中文问你怎么处理。",
      "心跳不会对准 8:25。精确时刻必须用 cron。",
    ],
  },
  {
    id: "heartbeat",
    title: "心跳巡检（便宜、不准时）",
    steps: [
      "每 30 分钟，限制在你时区 08:00–22:00。",
      "只跑 life.py due：到期 memo、48h 内过期食品、待确认小票。",
      "全空 → HEARTBEAT_OK，不说话。",
      "有事 → 最多两条短讯，更新 last_fired_at，6 小时内不重复。",
      "心跳里不做 OCR、不拉行情。",
    ],
  },
] as const;

export const ADVICE = [
  {
    title: "拆 skill，不拆数据库",
    body: "OpenClaw 平时只把 name + description 放进上下文。一个全能 skill 会在「记 38 块午饭」时灌进期权与保质期。六个说明书，共用 life.db。",
  },
  {
    title: "不要写进 weixin 插件",
    body: "openclaw-weixin 是通道：收图、发主动消息。技能放在 ~/.openclaw/workspace/skills/，优先级最高，也方便你把 .db 拷走。",
  },
  {
    title: "memos 是唯一出口",
    body: "冰箱和持仓只存事实。要开口，就写 memo，再挂 automation 或等心跳。否则 schema 再完整也不会找你。",
  },
  {
    title: "小票必须能看图",
    body: "OCR 走模型视觉，不接第三方。主会话配带视觉的模型；心跳可以用便宜文本模型。",
  },
] as const;

export const INSTALL_STEPS = [
  {
    title: "放到工作区",
    code: `cp -R life-os-skills ~/.openclaw/workspace/
mkdir -p ~/.openclaw/workspace/skills
for s in life-db life-memos life-finance life-fridge life-stocks life-proactive; do
  ln -sfn ../life-os-skills/skills/$s ~/.openclaw/workspace/skills/$s
done`,
  },
  {
    title: "初始化数据库",
    code: `python3 ~/.openclaw/workspace/life-os-skills/scripts/life.py init
python3 ~/.openclaw/workspace/life-os-skills/scripts/life.py path`,
  },
  {
    title: "贴进 AGENTS.md / HEARTBEAT.md",
    code: `# 见包内 workspace/AGENTS.snippet.md
# HEARTBEAT.md 保持 < 50 行，只放巡检清单`,
  },
  {
    title: "心跳（openclaw.json）",
    code: `{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "owner",
        activeHours: { start: "08:00", end: "22:00", timezone: "Asia/Shanghai" }
      }
    }
  }
}`,
  },
] as const;

export const RECEIPT_DEMO = {
  merchant: "盒马鲜生",
  when: "今天 19:12",
  payer: "你",
  lines: [
    { name: "生菜", qty: 1, cents: 490, food: true, days: 2, loc: "fridge" },
    { name: "西红柿", qty: 2, cents: 980, food: true, days: 5, loc: "counter" },
    { name: "鸡胸", qty: 1, cents: 2990, food: true, days: 2, loc: "fridge" },
    { name: "矿泉水", qty: 2, cents: 600, food: true, days: null, loc: "pantry" },
  ],
  footer: 5060,
} as const;
