function UploadSummary({ pages, documentsCount }) {
  if (!documentsCount) {
    return null;
  }

  return (
    <div className="alert alert-success rounded-4 shadow-sm mb-4" role="status">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="fs-4">✓</span>
        <h5 className="mb-0">Upload Successful</h5>
      </div>

      <div className="row g-3">
        <div className="col-sm-6">
          <div className="fw-semibold">Detected documents</div>
          <div>{documentsCount}</div>
        </div>
        <div className="col-sm-6">
          <div className="fw-semibold">Pages processed</div>
          <div>{pages}</div>
        </div>
      </div>
    </div>
  );
}

export default UploadSummary;
