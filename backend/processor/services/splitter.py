import os
import fitz

from django.core.files import File
from processor.models import SplitDocument


def split_pdf(uploaded_pdf, pdf_path, pages_info, output_folder):
    """
    Split the original PDF into multiple PDFs based on cover pages
    and save each split PDF in the database.
    """

    os.makedirs(output_folder, exist_ok=True)

    pdf = fitz.open(pdf_path)

    cover_pages = []

    for page in pages_info:
        if page["is_cover_page"]:
            cover_pages.append(
                (page["page"] - 1, page["document_number"])
            )

    split_documents = []

    for i, (start_page, doc_number) in enumerate(cover_pages):

        end_page = (
            cover_pages[i + 1][0] - 1
            if i + 1 < len(cover_pages)
            else len(pdf) - 1
        )

        new_pdf = fitz.open()

        for page_number in range(start_page, end_page + 1):
            new_pdf.insert_pdf(
                pdf,
                from_page=page_number,
                to_page=page_number
            )

        filename = f"{doc_number}.pdf"
        filepath = os.path.join(output_folder, filename)

        new_pdf.save(filepath)
        new_pdf.close()

        # Save in database
        split_doc = SplitDocument.objects.create(
            uploaded_pdf=uploaded_pdf,
            document_number=doc_number
        )

        with open(filepath, "rb") as f:
            split_doc.file.save(
                filename,
                File(f),
                save=True
            )

        split_documents.append(split_doc)

    pdf.close()

    return split_documents