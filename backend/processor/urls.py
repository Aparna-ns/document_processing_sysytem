from django.urls import path

from .views import (
    UploadPDFView,
    SplitDocumentListView,
    DownloadSplitDocumentView,
)

urlpatterns = [
    path(
        "upload/",
        UploadPDFView.as_view(),
        name="upload-pdf"
    ),

    path(
        "documents/",
        SplitDocumentListView.as_view(),
        name="document-list"
    ),

    path(
        "documents/<int:pk>/download/",
        DownloadSplitDocumentView.as_view(),
        name="download-document"
    ),
]