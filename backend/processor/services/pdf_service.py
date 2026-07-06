import fitz
import os


def pdf_to_images(pdf_path, output_folder):
    """
    Convert every page of a PDF into PNG images.
    """

    os.makedirs(output_folder, exist_ok=True)

    document = fitz.open(pdf_path)

    image_paths = []

    for page_number in range(len(document)):
        page = document.load_page(page_number)

        pix = page.get_pixmap(dpi=300)

        image_path = os.path.join(
            output_folder,
            f"page_{page_number + 1}.png"
        )

        pix.save(image_path)

        image_paths.append(image_path)

    document.close()

    return image_paths