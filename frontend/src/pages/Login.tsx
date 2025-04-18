
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if there's a token in the URL (from OAuth callback)
  // In Login.tsx
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      login(token);
      window.history.replaceState({}, document.title, window.location.pathname);
      // Don't navigate here - let the auth state trigger navigation
    }
  }, [location.search, login]); // Add proper dependencies


  // Redirect if already authenticated

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    const GOOGLE_CLIENT_ID= import.meta.env.GOOGLE_CLIENT_ID;

    try {
      // Redirect to Google OAuth
      window.location.href = `http://localhost:5050/auth/google?client_id=421952686329-h9ai0tpag5v8osid7td3geknp3iunini.apps.googleusercontent.com`;
    } catch (error) {
      setError("Failed to initiate Google login");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-checkme-pink-light via-white to-checkme-purple-light">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Checkme</CardTitle>
            <CardDescription>
              Sign in to book appointments and access your health dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-5 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 relative"
              >
                <FaGoogle className="text-xl text-red-500" />
                <span>Sign in with Google</span>
                {isLoading && (
                  <div className="absolute right-4 animate-spin h-5 w-5 border-2 border-checkme-pink border-t-transparent rounded-full"></div>
                )}
              </Button>
              
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              By signing in, you agree to our 
              <a href="#" className="text-checkme-pink hover:underline ml-1">
                Terms of Service
              </a> and <a href="#" className="text-checkme-pink hover:underline">
                Privacy Policy
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
