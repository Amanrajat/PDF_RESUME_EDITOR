import fitz

def extract_pdf_blocks(pdf_path):
    doc = fitz.open(pdf_path)
    blocks_data = []

    for page_index, page in enumerate(doc):
        text_dict = page.get_text("dict")

        for block in text_dict["blocks"]:
            if block["type"] != 0:
                continue

            for line in block["lines"]:
                line_text = " ".join(
                    span["text"] for span in line["spans"]
                ).strip()

                if not line_text:
                    continue

                blocks_data.append({
                    "page": page_index,
                    "text": line_text,
                    "bbox": line["bbox"],   
                    "size": line["spans"][0]["size"],
                    "font": line["spans"][0]["font"],
                    "color": line["spans"][0]["color"],
                })

    doc.close()
    return blocks_data
