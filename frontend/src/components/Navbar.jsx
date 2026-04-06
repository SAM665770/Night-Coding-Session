import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Hide navbar on auth pages
  if (["/login", "/signup", "/"].includes(location.pathname)) return null;

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-bold text-orange-500 tracking-tight">
        AI Interview Prep
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 hover:text-orange-500 font-medium transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-orange-500 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
