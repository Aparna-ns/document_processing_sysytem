import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="bg-primary bg-opacity-10 rounded-3 p-2 d-flex align-items-center justify-content-center">
            <i className="bi bi-folder2-open fs-4 text-primary"></i>
          </div>
          <div>
            <span className="fw-semibold text-dark">Document Processing System</span>
            <div className="text-muted small">PDF document automation</div>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
