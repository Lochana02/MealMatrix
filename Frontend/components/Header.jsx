import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("mm_token");
    const storedUser = localStorage.getItem("mm_user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <div className="text-2xl font-black italic text-orange-800 tracking-tight font-['Plus_Jakarta_Sans']">
          Meal Matrix
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#categories"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-orange-700 border-b-2 border-orange-700 pb-1 hover:opacity-80 transition-all duration-300"
          >
            Category
          </a>
          <a
            href="/Menu"
            onClick={(e) => {
              e.preventDefault();
              navigate("/Menu");
            }}
            className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-stone-600 hover:text-orange-600 transition-all duration-300"
          >
            Menu
          </a>
          <a
            href="/feedback"
            onClick={(e) => {
              e.preventDefault();
              navigate("/feedback");
            }}
            className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-stone-600 hover:text-orange-600 transition-all duration-300"
          >
            Feedback
          </a>
        </div>

        <div className="relative">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:opacity-80 transition-all border border-stone-200 rounded-full p-1 bg-stone-50"
              >
                <span className="material-symbols-outlined text-3xl text-orange-800">
                  account_circle
                </span>
                <span className="text-sm font-bold text-stone-700 hidden md:block">
                  {user?.firstName}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-[60] overflow-hidden animate-in fade-in zoom-in duration-200">
                  {user?.type === "admin" && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/admin-dashboard");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-800 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">dashboard</span>
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-700 text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-tight active:scale-95 duration-150 transition-all hover:opacity-90"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;