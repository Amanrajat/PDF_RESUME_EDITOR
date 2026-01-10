import fitz
import os

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16) / 255,
        int(hex_color[2:4], 16) / 255,
        int(hex_color[4:6], 16) / 255,
    )

FONT_MAP = {
    ("Helvetica", False, False): "helv",
    ("Helvetica", True, False): "helvB",
    ("Helvetica", False, True): "helvI",
    ("Helvetica", True, True): "helvBI",
    ("Times-Roman", False, False): "times",
    ("Courier", False, False): "cour",
}

def regenerate_pdf(input_path, output_path, blocks):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = fitz.open(input_path)

    for block in blocks:
        try:
            page = doc[int(block["page"])]
            rect = fitz.Rect(*block["bbox"])

            original = (block.get("text") or "").strip()
            new_text = (block.get("new_text") or "").strip()

            # ✅ अगर empty या same text → SKIP (important)
            if not new_text or new_text == original:
                continue

            font_family = block.get("font", "Helvetica")
            bold = block.get("bold", False)
            italic = block.get("italic", False)

            fontname = FONT_MAP.get(
                (font_family, bold, italic),
                "helv"
            )

            fontsize = float(block.get("size", 12))
            color = hex_to_rgb(block.get("color", "#000000"))

            # 🔥 TRY INSERT FIRST (NO REDACTION YET)
            rc = page.insert_textbox(
                rect,
                new_text,
                fontsize=fontsize,
                fontname=fontname,
                color=color,
                align=fitz.TEXT_ALIGN_LEFT,
                lineheight=1.0,
            )

            # ❌ अगर text fit नहीं हुआ → font shrink
            while rc < 0 and fontsize > 6:
                fontsize -= 0.5
                rc = page.insert_textbox(
                    rect,
                    new_text,
                    fontsize=fontsize,
                    fontname=fontname,
                    color=color,
                    align=fitz.TEXT_ALIGN_LEFT,
                    lineheight=1.0,
                )

            # ❌ STILL NOT FIT → SKIP (DON’T ERASE ORIGINAL)
            if rc < 0:
                print("⚠️ Text skipped (overflow):", new_text)
                continue

            # ✅ SUCCESS → NOW remove old text
            page.add_redact_annot(rect, fill=(1, 1, 1))
            page.apply_redactions()

            # ✅ RE-DRAW once more (final)
            page.insert_textbox(
                rect,
                new_text,
                fontsize=fontsize,
                fontname=fontname,
                color=color,
                align=fitz.TEXT_ALIGN_LEFT,
                lineheight=1.0,
            )

        except Exception as e:
            print("⚠️ Block skipped:", e)

    doc.save(output_path, clean=True, deflate=True)
    doc.close()
