import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { DmDashboardPage } from "../pages/DmDashboardPage";
import { PlayerDashboardPage } from "../pages/PlayerDashboardPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/dashboard/dm",
    element: (
      <ProtectedRoute role="DM">
        <DmDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/player",
    element: (
      <ProtectedRoute role="PLAYER">
        <PlayerDashboardPage />
      </ProtectedRoute>
    ),
  },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
