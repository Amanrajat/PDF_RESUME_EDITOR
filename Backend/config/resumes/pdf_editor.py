import fitz  # PyMuPDF

def edit_resume(input_path, output_path, experience="", skill=""):
    """
    TEMP working function (sirf error fix ke liye)
    """
    doc = fitz.open(input_path)
    doc.save(output_path)
    doc.close()
