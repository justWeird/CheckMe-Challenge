import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardRedirect = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && user) {
            const role = user.role?.toLowerCase();
            if (role === "doctor") {
                navigate("/doctor-dashboard", { replace: true });
            } else {
                navigate("/patient-dashboard", { replace: true });
            }
        }
    }, [user, isLoading, navigate]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-checkme-purple border-t-transparent rounded-full" />
            </div>
        );
    }

    // while navigating, show nothing
    return null;
};

export default DashboardRedirect;
