import os
import pytesseract
from PIL import Image

# Windows only
if os.name == "nt":
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

def image_to_text(image_path):
    image = Image.open(image_path)
    return pytesseract.image_to_string(image, lang="eng")