function EmptyState({ message }) {
  return (
    <div className="border rounded-4 p-4 text-center bg-white shadow-sm">
      <i className="bi bi-folder-x display-4 text-secondary"></i>
      <p className="mb-0 mt-3 text-muted">{message}</p>
    </div>
  );
}

export default EmptyState;
