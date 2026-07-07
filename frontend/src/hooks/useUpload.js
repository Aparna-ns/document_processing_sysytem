import { useState, useCallback } from 'react';
import { uploadDocument, getUploadErrorMessage } from '../services/uploadService.js';

export default function useUpload() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [pagesProcessed, setPagesProcessed] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileSelect = useCallback((selectedFile) => {
    setError(null);
    setSuccessMessage('');
    setPagesProcessed(0);
    setFile(selectedFile);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage('');
  }, []);

  const upload = useCallback(async () => {
    if (!file || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage('');

    try {
      const data = await uploadDocument(file);
      setDocuments(data.documents || []);
      setPagesProcessed(data.pages ? data.pages.length : 0);
      setSuccessMessage('Upload successful.');
    } catch (uploadError) {
      setError(getUploadErrorMessage(uploadError));
      setDocuments([]);
      setPagesProcessed(0);
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing]);

  return {
    file,
    documents,
    pagesProcessed,
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
