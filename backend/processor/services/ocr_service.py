import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

print("Using Tesseract:", pytesseract.pytesseract.tesseract_cmd)

def image_to_text(image_path):
    image = Image.open(image_path)
    return pytesseract.image_to_string(image, lang="eng")