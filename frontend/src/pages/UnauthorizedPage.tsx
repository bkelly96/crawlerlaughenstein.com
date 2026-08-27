import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="page">
      <h1>Unauthorized</h1>
      <p>You don't have access to that page.</p>
      <Link to="/login">Back to login</Link>
    </div>
  );
}
