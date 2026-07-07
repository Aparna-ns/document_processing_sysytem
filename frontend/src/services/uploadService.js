import apiClient from '../api/api.js';
import { UPLOAD_ENDPOINT, DOWNLOAD_DOCUMENT_ENDPOINT } from '../config/apiEndpoints.js';

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(UPLOAD_ENDPOINT, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function downloadDocument(id) {
  const response = await apiClient.get(DOWNLOAD_DOCUMENT_ENDPOINT(id), {
    responseType: 'blob',
  });

  return response.data;
}

export function getUploadErrorMessage(error) {
  if (error.isNetworkError) {
    return 'Network unavailable. Please check your connection.';
  }

  if (error.isServerError) {
    return 'Server error. Please try again later.';
  }

  if (error.isClientError) {
    return 'Upload failed. Please verify the PDF and try again.';
  }

  return 'OCR processing failed. Please upload a valid PDF and try again.';
}

export function getDownloadErrorMessage(error) {
  if (error.isNetworkError) {
    return 'Network unavailable. Please check your connection.';
  }

  if (error.isServerError) {
    return 'Unable to download the file right now. Please try again later.';
  }

  return 'Download failed. Please try again.';
}
