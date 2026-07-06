import axios from 'axios';

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, ''),
  headers: {
    'Accept': 'application/json',
  },
});

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function downloadDocument(id) {
  const response = await apiClient.get(`/api/documents/${id}/download/`, {
    responseType: 'blob',
  });

  return response.data;
}

export default apiClient;
