
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-checkme-pink border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    // Redirect to appropriate dashboard based on role if not authorized
    if (user?.role === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    } else {
      return <Navigate to="/patient-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
