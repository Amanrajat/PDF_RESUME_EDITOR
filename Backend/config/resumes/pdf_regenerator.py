import fitz
import os

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16) / 255,
        int(hex_color[2:4], 16) / 255,
        int(hex_color[4:6], 16) / 255,
    )

FONT_NAME_MAP = {
    ("Helvetica", False, False): "helv",
    ("Helvetica", True, False): "helvB",
    ("Helvetica", False, True): "helvI",
    ("Times-Roman", False, False): "times",
    ("Times-Roman", True, False): "timesB",
    ("Courier", False, False): "cour",
}

def regenerate_pdf(input_path, output_path, blocks):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    doc = fitz.open(input_path)

    for block in blocks:
        try:
            page = doc[int(block["page"])]
            rect = fitz.Rect(*block["bbox"])

            new_text = block.get("new_text")
            if not new_text:
                continue

            
            page.add_redact_annot(rect, fill=(1, 1, 1))
            page.apply_redactions()

            font_family = block.get("font", "Helvetica")
            bold = block.get("bold", False)
            italic = block.get("italic", False)

            fontname = FONT_NAME_MAP.get(
                (font_family, bold, italic),
                "helv"
            )

            page.insert_text(
                (rect.x0, rect.y1 - 1),
                new_text,
                fontsize=float(block.get("size", 12)),
                fontname=fontname,
                color=hex_to_rgb(block.get("color", "#000000")),
            )

        except Exception as e:
            print("⚠️ Block skipped:", e)

    doc.save(output_path, garbage=4, deflate=True, clean=True)
    doc.close()

   
