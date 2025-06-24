import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
