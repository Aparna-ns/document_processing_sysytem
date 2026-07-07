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

class UploadPDFView(APIView):

    def post(self, request):

        serializer = UploadedPDFSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        pdf = serializer.save()
        pdf_path = pdf.file.path

        image_folder = os.path.join("media", "images", str(pdf.id))
        os.makedirs(image_folder, exist_ok=True)

        pages = []

        document = fitz.open(pdf_path)

        try:
            for page_number in range(len(document)):

                page = document.load_page(page_number)

                # Reduced DPI to lower memory usage
                pix = page.get_pixmap(dpi=150)

                image_path = os.path.join(
                    image_folder,
                    f"page_{page_number + 1}.png"
                )

                pix.save(image_path)

                # OCR
                text = image_to_text(image_path)

                # Classification
                result = classify_page(text)

                pages.append({
                    "page": page_number + 1,
                    **result
                })

                # Delete temporary image immediately
                if os.path.exists(image_path):
                    os.remove(image_path)

                # Release memory
                del pix
                del page

        finally:
            document.close()

        output_folder = os.path.join(
            "media",
            "output",
            str(pdf.id)
        )

        split_documents = split_pdf(
            uploaded_pdf=pdf,
            pdf_path=pdf_path,
            pages_info=pages,
            output_folder=output_folder
        )

        document_serializer = SplitDocumentSerializer(
            split_documents,
            many=True
        )

        return Response({
            "pages": pages,
            "documents": document_serializer.data
        })
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