export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const UPLOAD_ENDPOINT = '/upload/';
export const DOWNLOAD_DOCUMENT_ENDPOINT = (id) => `/documents/${id}/download/`;
