import { useRef } from 'react';

function UploadCard({ file, onFileChange, onUpload, disabled, isProcessing, clearMessages }) {
  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onFileChange(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileInputChange = (event) => {
    clearMessages();
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 upload-card">
      <div className="card-body p-4">
        <div
          className="border border-dashed rounded-4 p-5 text-center drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          role="button"
          tabIndex={0}
        >
          <div className="mb-3">
            <i className="bi bi-cloud-upload-fill display-4 text-primary"></i>
          </div>
          <h3 className="h5 fw-semibold mb-3">Upload a combined PDF</h3>
          <p className="text-muted mb-4">
            Drag and drop your file here, or choose a PDF to start processing.
          </p>

          <button
            type="button"
            className="btn btn-primary px-4"
            onClick={handleButtonClick}
            disabled={disabled || isProcessing}
          >
            Choose File
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="d-none"
            onChange={handleFileInputChange}
          />

          {file && (
            <div className="mt-4 text-start text-truncate">
              <span className="fw-semibold">Selected file:</span>
              <div className="mt-2 text-truncate">{file.name}</div>
            </div>
          )}

          <button
            type="button"
            className="btn btn-success mt-4 w-100"
            disabled={!file || isProcessing}
            onClick={onUpload}
          >
            Upload & Process
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadCard;
