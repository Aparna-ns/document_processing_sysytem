from rest_framework import serializers
from .models import UploadedPDF, SplitDocument


class UploadedPDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedPDF
        fields = "__all__"


class SplitDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = SplitDocument
        fields = [
            "id",
            "document_number",
            "created_at"
        ]