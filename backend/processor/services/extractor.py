import re

PATTERNS = [
    r"Document\s*Number\s*[:\-]?\s*([A-Za-z0-9\-/]+)",
    r"Document\s*No\.?\s*[:\-]?\s*([A-Za-z0-9\-/]+)",
    r"Doc\.?\s*Number\s*[:\-]?\s*([A-Za-z0-9\-/]+)",
    r"Doc\.?\s*No\.?\s*[:\-]?\s*([A-Za-z0-9\-/]+)",
]


def extract_document_number(text):
    for pattern in PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()

    return None