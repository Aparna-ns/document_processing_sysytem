function DocumentTable({ documents, onDownload }) {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="table-responsive rounded-4 overflow-hidden shadow-sm border">
      <table className="table mb-0">
        <thead className="table-light">
          <tr>
            <th>Document Number</th>
            <th>Created Time</th>
            <th className="text-end">Download</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>{document.document_number}</td>
              <td>{new Date(document.created_at).toLocaleString()}</td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => onDownload(document.id)}
                >
                  <i className="bi bi-cloud-download me-2"></i>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentTable;
