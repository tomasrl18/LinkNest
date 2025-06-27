import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export function PrivateRoute() {
    const { user, session } = useAuth();

    if (session === undefined) {
        return null;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
