import os
import gc
import pytesseract
from PIL import Image

if os.name == "nt":
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

def image_to_text(image_path):
    with Image.open(image_path) as image:
        text = pytesseract.image_to_string(image, lang="eng")

    gc.collect()
    return text