import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import UploadCard from '../components/UploadCard.jsx';
import ProcessingLoader from '../components/ProcessingLoader.jsx';
import DocumentTable from '../components/DocumentTable.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import UploadSummary from '../components/UploadSummary.jsx';
import useUpload from '../hooks/useUpload.js';
import { downloadDocument, getDownloadErrorMessage } from '../services/uploadService.js';

function Dashboard() {
  const {
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
  } = useUpload();

  const [downloadMessage, setDownloadMessage] = useState('');

  const handleDownload = async (id) => {
    setError(null);
    setSuccessMessage('');
    setDownloadMessage('');

    try {
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadMessage('Download started successfully.');
    } catch (downloadError) {
      setError(getDownloadErrorMessage(downloadError));
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <main className="container py-5">
        <div className="mx-auto application-shell">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 hero-card">
            <div className="card-body">
              <div className="d-flex align-items-start gap-3 flex-column flex-md-row">
                <div>
                  <span className="badge bg-primary bg-opacity-15 text-primary rounded-pill mb-3">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Fast Processing
                  </span>
                  <h1 className="display-6 fw-bold mb-3">Document Processing System</h1>
                  <p className="text-muted mb-3">
                    Upload a combined PDF and let the system detect cover pages, extract document numbers, split documents automatically, and make each file available for download.
                  </p>
                  <div className="d-flex flex-wrap gap-2 text-muted small">
                    <span className="badge rounded-pill bg-white border py-2 px-3">PDF Upload</span>
                    <span className="badge rounded-pill bg-white border py-2 px-3">Auto Split</span>
                    <span className="badge rounded-pill bg-white border py-2 px-3">Download Ready</span>
                  </div>
                </div>
                <div className="ms-md-auto text-center text-md-end">
                  <div className="rounded-4 bg-primary bg-opacity-10 p-3">
                    <i className="bi bi-file-earmark-arrow-up display-4 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <UploadCard
            file={file}
            onFileChange={handleFileSelect}
            onUpload={upload}
            disabled={false}
            isProcessing={isProcessing}
            clearMessages={clearMessages}
          />

          <div className="mt-4 status-panel p-3 rounded-4 shadow-sm">
            <ProcessingLoader isProcessing={isProcessing} />
            <ErrorAlert message={error} />
            {successMessage && <UploadSummary pages={pagesProcessed} documentsCount={documents.length} />}
            {downloadMessage && (
              <div className="alert alert-success rounded-4 shadow-sm" role="alert">
                {downloadMessage}
              </div>
            )}

            {documents.length > 0 ? (
              <DocumentTable documents={documents} onDownload={handleDownload} />
            ) : (
              !isProcessing && <EmptyState message="No documents generated." />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-top py-4">
        <div className="container text-center text-muted small footer-brand">
          Version v1.0
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
