import fitz

def extract_pdf_blocks(pdf_path):
    doc = fitz.open(pdf_path)
    blocks = []

    for page_index, page in enumerate(doc):
        links = page.get_links()
        text_dict = page.get_text("dict")

        for block in text_dict["blocks"]:
            if block["type"] != 0:
                continue

            for line in block["lines"]:
                text = " ".join(span["text"] for span in line["spans"]).strip()
                if not text:
                    continue

                rect = fitz.Rect(line["bbox"])

                # 🔒 Detect link overlap
                has_link = False
                for link in links:
                    if fitz.Rect(link["from"]).intersects(rect):
                        has_link = True
                        break

                blocks.append({
                    "page": page_index,
                    "text": text,
                    "bbox": list(rect),
                    "size": line["spans"][0]["size"],
                    "font": line["spans"][0]["font"],
                    "color": "#000000",
                    "bold": False,
                    "italic": False,
                    "has_link": has_link
                })

    doc.close()
    return blocks
