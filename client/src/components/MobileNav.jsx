import { Link, useLocation } from "react-router-dom";

const MobileNav = () => {
  const location = useLocation();

  // ✅ helper for active icon
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around bg-black text-white p-3 border-t border-gray-800 md:hidden z-50">

      {/* HOME */}
      <Link to="/">
        <span
          className={`text-2xl ${
            isActive("/") ? "text-white" : "text-gray-500"
          }`}
        >
          🏠
        </span>
      </Link>

      {/* SEARCH */}
      <Link to="/search">
        <span
          className={`text-2xl ${
            isActive("/search") ? "text-white" : "text-gray-500"
          }`}
        >
          🔍
        </span>
      </Link>

      {/* CREATE */}
      <Link to="/create">
        <span
          className={`text-2xl ${
            isActive("/create") ? "text-white" : "text-gray-500"
          }`}
        >
          ➕
        </span>
      </Link>

      {/* NOTIFICATIONS */}
      <Link to="/notifications">
        <span
          className={`text-2xl ${
            isActive("/notifications") ? "text-white" : "text-gray-500"
          }`}
        >
          ❤️
        </span>
      </Link>

      {/* PROFILE */}
      <Link to="/profile">
        <span
          className={`text-2xl ${
            isActive("/profile") ? "text-white" : "text-gray-500"
          }`}
        >
          👤
        </span>
      </Link>

    </div>
  );
};

export default MobileNav;