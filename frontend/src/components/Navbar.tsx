
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for changing navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || isAuthenticated
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-checkme-pink">Check</span>
              <span className="text-checkme-purple">Me</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-gray-800 hover:text-checkme-pink ${
                location.pathname === "/" ? "font-medium text-checkme-pink" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-gray-800 hover:text-checkme-pink ${
                location.pathname === "/about" ? "font-medium text-checkme-pink" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/services"
              className={`text-gray-800 hover:text-checkme-pink ${
                location.pathname === "/services" ? "font-medium text-checkme-pink" : ""
              }`}
            >
              Services
            </Link>
            <Link
              to="/contact"
              className={`text-gray-800 hover:text-checkme-pink ${
                location.pathname === "/contact" ? "font-medium text-checkme-pink" : ""
              }`}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-checkme-purple flex items-center justify-center text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={user?.role === "DOCTOR" ? "/doctor-dashboard" : "/patient-dashboard"}>
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-checkme-pink hover:bg-checkme-pink-dark text-white font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 px-2 bg-white rounded-lg shadow-lg absolute top-16 right-4 left-4">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md ${
                  location.pathname === "/"
                    ? "bg-checkme-pink-light text-checkme-pink font-medium"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-md ${
                  location.pathname === "/about"
                    ? "bg-checkme-pink-light text-checkme-pink font-medium"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                About
              </Link>
              <Link
                to="/services"
                className={`px-4 py-2 rounded-md ${
                  location.pathname === "/services"
                    ? "bg-checkme-pink-light text-checkme-pink font-medium"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 rounded-md ${
                  location.pathname === "/contact"
                    ? "bg-checkme-pink-light text-checkme-pink font-medium"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    to={user?.role === "DOCTOR" ? "/doctor-dashboard" : "/patient-dashboard"}
                    className="px-4 py-2 rounded-md text-gray-800 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md text-gray-800 hover:bg-gray-100 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-checkme-pink text-white font-medium"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
