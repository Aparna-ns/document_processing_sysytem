import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    UploadedPDFSerializer,
    SplitDocumentSerializer,
)
from .services.pdf_service import pdf_to_images
from .services.ocr_service import image_to_text
from .services.classifier import classify_page
from .services.splitter import split_pdf

from django.shortcuts import get_object_or_404
from django.http import FileResponse

from .models import SplitDocument


from pathlib import Path
import os
import fitz

import traceback
import logging

logger = logging.getLogger(__name__)

class UploadPDFView(APIView):

    def post(self, request):
        try:
            serializer = UploadedPDFSerializer(data=request.data)

            if not serializer.is_valid():
                return Response(serializer.errors, status=400)

            pdf = serializer.save()
            pdf_path = pdf.file.path

            logger.info(f"PDF saved: {pdf_path}")

            image_folder = os.path.join("media", "images", str(pdf.id))
            os.makedirs(image_folder, exist_ok=True)

            pages = []

            document = fitz.open(pdf_path)

            try:
                for page_number in range(len(document)):
                    logger.info(f"Processing page {page_number + 1}")

                    page = document.load_page(page_number)
                    text = page.get_text().strip()
                    image_path = None
                    pix = None

                    if not text:
                        pix = page.get_pixmap(dpi=96)

                        image_path = os.path.join(
                            image_folder,
                            f"page_{page_number + 1}.png"
                        )

                        pix.save(image_path)

                        logger.info("Running OCR")
                        text = image_to_text(image_path)

                        os.remove(image_path)
                        del pix

                    logger.info("Classifying")
                    result = classify_page(text)

                    pages.append({
                        "page": page_number + 1,
                        **result
                    })

                    os.remove(image_path)

                    del pix
                    del page

            finally:
                document.close()

            logger.info("Splitting PDF")

            output_folder = os.path.join("media", "output", str(pdf.id))

            split_documents = split_pdf(
                uploaded_pdf=pdf,
                pdf_path=pdf_path,
                pages_info=pages,
                output_folder=output_folder
            )

            serializer = SplitDocumentSerializer(split_documents, many=True)

            return Response({
                "pages": pages,
                "documents": serializer.data
            })

        except Exception:
            logger.exception("Upload failed")
            return Response({"error": traceback.format_exc()}, status=500)
class SplitDocumentListView(APIView):

    def get(self, request):

        documents = SplitDocument.objects.all().order_by("-created_at")

        serializer = SplitDocumentSerializer(
            documents,
            many=True
        )

        return Response(serializer.data)
class DownloadSplitDocumentView(APIView):

    def get(self, request, pk):

        document = get_object_or_404(
            SplitDocument,
            pk=pk
        )

        return FileResponse(
            document.file.open("rb"),
            as_attachment=True,
            filename=f"{document.document_number}.pdf"
        )