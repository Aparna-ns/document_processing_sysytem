from .extractor import extract_document_number


def classify_page(text):

    document_number = extract_document_number(text)

    if document_number:

        return {
            "is_cover_page": True,
            "document_number": document_number
        }

    return {
        "is_cover_page": False,
        "document_number": None
    }