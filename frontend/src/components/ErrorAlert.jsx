function ErrorAlert({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="alert alert-danger rounded-4 shadow-sm" role="alert">
      {message}
    </div>
  );
}

export default ErrorAlert;
