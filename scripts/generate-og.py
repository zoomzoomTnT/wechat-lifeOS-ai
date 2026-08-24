#!/usr/bin/env python3
"""Draw the 生活台账 share card — paper ledger, pine seal, CJK title."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630
PAPER = (243, 238, 228)
INK = (26, 24, 20)
PINE = (47, 93, 80)
PINE_DARK = (30, 61, 53)
RULE = (26, 24, 20, 28)
SEAL = (154, 59, 47)

FONT = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"
OUT_RAW = Path("/tmp/life-ledger-og-raw.png")
OUT = Path("/workspace/public/og.jpg")


def font(size: int, index: int = 0) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(FONT, size=size, index=index)
    except OSError:
        return ImageFont.load_default()


def main() -> None:
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img, "RGBA")

    # faint ledger rules
    for y in range(72, H - 48, 28):
        draw.line([(72, y), (W - 72, y)], fill=RULE, width=1)

    # inner frame
    draw.rectangle([48, 36, W - 48, H - 36], outline=(26, 24, 20, 40), width=1)
    draw.rectangle([56, 44, W - 56, H - 44], outline=(47, 93, 80, 70), width=2)

    # wax seal — upper right, inside margins
    cx, cy, r = 980, 168, 54
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=PINE)
    draw.ellipse(
        [cx - r + 8, cy - r + 8, cx + r - 8, cy + r - 8], outline=(243, 238, 228, 180), width=2
    )
    chop = font(28)
    draw.text((cx, cy), "账", font=chop, fill=PAPER, anchor="mm")

    title = font(92)
    sub = font(36)
    tag = font(22)

    draw.text((W // 2, 268), "生活台账", font=title, fill=INK, anchor="mm")
    draw.text((W // 2, 360), "Life Ledger", font=sub, fill=PINE_DARK, anchor="mm")
    draw.text(
        (W // 2, 430),
        "OpenClaw  ·  微信  ·  SQLite",
        font=tag,
        fill=(26, 24, 20, 160),
        anchor="mm",
    )

    OUT_RAW.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(OUT_RAW, "PNG")
    print("raw", OUT_RAW)


if __name__ == "__main__":
    main()
