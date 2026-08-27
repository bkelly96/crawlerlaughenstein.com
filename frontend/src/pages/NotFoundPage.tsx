import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="page">
      <h1>Not found</h1>
      <Link to="/login">Back to login</Link>
    </div>
  );
}
