from django.db import models


class UploadedPDF(models.Model):
    file = models.FileField(upload_to="pdfs/")
    uploaded_at = models.DateTimeField(auto_now_add=True)


class SplitDocument(models.Model):
    uploaded_pdf = models.ForeignKey(
        UploadedPDF,
        on_delete=models.CASCADE,
        related_name="split_documents"
    )

    document_number = models.CharField(max_length=100)

    file = models.FileField(upload_to="split_documents/")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.document_number