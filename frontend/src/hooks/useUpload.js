import { useState, useCallback } from 'react';
import { uploadDocument } from '../services/api.js';

export default function useUpload() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileSelect = useCallback((selectedFile) => {
    setError(null);
    setSuccessMessage('');
    setFile(selectedFile);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage('');
  }, []);

  const upload = useCallback(async () => {
    if (!file) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage('');

    try {
      const data = await uploadDocument(file);
      setDocuments(data.documents || []);
    } catch (uploadError) {
      if (uploadError.response) {
        setError('Upload failed.');
      } else {
        setError('Unable to connect to server.');
      }
      setDocuments([]);
    } finally {
      setIsProcessing(false);
    }
  }, [file]);

  return {
    file,
    documents,
    isProcessing,
    error,
    successMessage,
    handleFileSelect,
    upload,
    setError,
    setSuccessMessage,
    clearMessages,
  };
}
