import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopNavAdmin = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    navigate("/login");
  };
  return (
    <header className="fixed top-0 w-full z-50 bg-stone-50/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold tracking-tight text-orange-900 font-['Plus_Jakarta_Sans']">
          Heirloom Ledger
        </h1>

        <div className="hidden md:flex relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search menu items..."
            className="bg-[#e6e2d7] border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-[#005ab7] transition-all outline-none"
          />
        </div>

        <nav className="hidden lg:flex items-center gap-6 ml-8">
          <a
            href="#"
            className="text-sm font-bold text-stone-600 hover:text-[#7c2800] transition-colors font-['Plus_Jakarta_Sans'] uppercase tracking-tight"
          >
            Category
          </a>
          <a
            href="#"
            className="text-sm font-bold text-stone-600 hover:text-[#7c2800] transition-colors font-['Plus_Jakarta_Sans'] uppercase tracking-tight"
          >
            Orders
          </a>
          <a
            href="#"
            className="text-sm font-bold text-stone-600 hover:text-[#7c2800] transition-colors font-['Plus_Jakarta_Sans'] uppercase tracking-tight"
          >
            Menu
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-stone-200/50 transition-colors text-stone-600">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <button className="p-2 rounded-full hover:bg-stone-200/50 transition-colors text-stone-600">
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-8 w-8 rounded-full overflow-hidden bg-stone-200 ml-2 block hover:opacity-80 transition-opacity"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEXzeA4I43F756I5eAR7XxNUtpRR4SjfgtFxRdn9rp7uRGqvyrH-yogBimPbJJlVbqsTEaqXyjM2nAKCSzUCfJYrTadSyIu-KPiCQ35snbjUI1Ki8al_S6k2gsACR4bQwEwfhzSDQcJkgyLrxtpXJEayvdDNwkyowdCz1_iQTHFv7SwLi93AqX6N7T36YUZkn9zXeE9Qht6CTK1Ta2JoDWKPAxNnBorl1pb-1SxjGWUlp_YwbxMU8JduGP2-3SM6enq8F-KRsv79xL"
              alt="Admin Profile Avatar"
              className="h-full w-full object-cover"
            />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
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
      </div>
    </header>
  );
};

export default TopNavAdmin;