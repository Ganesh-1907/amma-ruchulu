import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminApi from "../services/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch the user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminApi.auth.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUser();
  }, []);

  // Close mobile menu when a navigation link is clicked
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove token from localStorage
    toast.success("Logged out successfully"); // Show toast message
    navigate("/login"); // Redirect to login page
  };

  // Define nav items
  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/products", label: "Products" },
    { path: "/orders", label: "Orders" },
    { path: "/logout", label: "Logout", isLogout: true }, // Add isLogout flag
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-[0_4px_12px_rgba(255,0,0,0.5)] transition-shadow duration-300 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="logo" className="w-10 h-auto" />
              <span className="text-xl font-extrabold text-red-600">
                MA AMMA RUCHULU
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.isLogout ? (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-medium text-sm transition-all duration-200"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? "text-red-600 border-b-2 border-red-600 font-bold"
                      : "text-gray-600 hover:text-red-600 hover:font-bold"
                  } px-3 py-2 text-sm font-medium transition-all duration-200`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="hidden md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`hidden md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) =>
            item.isLogout ? (
              <button
                key={item.label}
                onClick={() => {
                  handleLogout();
                  handleNavClick();
                }}
                className="block w-full text-left text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`${
                  location.pathname === item.path
                    ? "bg-red-100 text-red-600 font-bold"
                    : "text-gray-600 hover:bg-red-50 hover:text-red-600 hover:font-bold"
                } block px-3 py-2 rounded-md text-base font-medium transition-all duration-200`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
