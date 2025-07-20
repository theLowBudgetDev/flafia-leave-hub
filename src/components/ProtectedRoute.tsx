import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "staff" | "admin";
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect staff to staff dashboard if they try to access admin routes
    if (user?.role === "staff" && requiredRole === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    // Redirect admin to admin dashboard if they try to access staff routes
    if (user?.role === "admin" && requiredRole === "staff") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};