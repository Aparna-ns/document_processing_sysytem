import gc
import os

import pytesseract
from PIL import Image

if os.name == "nt":
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )


def image_to_text(image_path):
    with Image.open(image_path) as img:
        text = pytesseract.image_to_string(img, lang="eng")

    gc.collect()
    return text