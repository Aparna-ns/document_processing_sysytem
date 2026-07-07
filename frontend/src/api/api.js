import axios from 'axios';
import { API_BASE_URL } from '../config/apiEndpoints.js';

const baseURL = (API_BASE_URL || '/api').replace(/\/+$/g, '');

const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && error.request) {
      return Promise.reject({ ...error, isNetworkError: true });
    }

    if (error.response) {
      const status = error.response.status;
      if (status >= 500) {
        return Promise.reject({ ...error, isServerError: true });
      }
      if (status >= 400) {
        return Promise.reject({ ...error, isClientError: true });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
