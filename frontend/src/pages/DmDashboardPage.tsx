import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";

export function DmDashboardPage() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ message: string }>("/api/dashboard/dm").then((res) => setMessage(res.message));
  }, []);

  return (
    <div className="page">
      <h1>DM Dashboard</h1>
      <p>Welcome, {user?.username}.</p>
      <p>{message ?? "Loading..."}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
