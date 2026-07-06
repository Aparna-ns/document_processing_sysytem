function ProcessingLoader({ isProcessing }) {
  if (!isProcessing) {
    return null;
  }

  return (
    <div className="alert alert-info d-flex align-items-center gap-3 mb-4" role="alert">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div>
        <h6 className="mb-1">Processing PDF...</h6>
        <p className="mb-0 text-muted">Please wait while the document is processed.</p>
      </div>
    </div>
  );
}

export default ProcessingLoader;
