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


class UploadPDFView(APIView):

    def post(self, request):

        serializer = UploadedPDFSerializer(data=request.data)

        if serializer.is_valid():

            # Save uploaded PDF
            pdf = serializer.save()

            pdf_path = pdf.file.path

            # Folder for page images
            image_folder = os.path.join(
                "media",
                "images",
                str(pdf.id)
            )

            image_paths = pdf_to_images(
                pdf_path,
                image_folder
            )

            pages = []

            # OCR every page
            for index, image in enumerate(image_paths):

                text = image_to_text(image)

                result = classify_page(text)

                pages.append({
                    "page": index + 1,
                    **result
                })

            # Split PDF
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

            # Serialize split documents
            document_serializer = SplitDocumentSerializer(
                split_documents,
                many=True
            )

            return Response({
                "pages": pages,
                "documents": document_serializer.data
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
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