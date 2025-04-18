
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-checkme-pink-light via-white to-checkme-purple-light p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-bold text-checkme-pink">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            We're sorry, but the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-checkme-pink hover:bg-checkme-pink-dark text-white px-6 py-2 rounded-full">
                Return Home
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-checkme-purple text-checkme-purple hover:bg-checkme-purple hover:text-white px-6 py-2 rounded-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
