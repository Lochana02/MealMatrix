import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SideNavAdmin = ({ onAddItem }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      try {
        const res = await axios.get(`${apiBaseUrl}/categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch sidebar categories", err);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryIcon = (name) => {
    const lower = name?.toLowerCase() || '';
    if (lower.includes('drink') || lower.includes('beverage')) return 'local_bar';
    if (lower.includes('breakfast')) return 'breakfast_dining';
    if (lower.includes('lunch') || lower.includes('dinner')) return 'restaurant';
    if (lower.includes('snack')) return 'fastfood';
    if (lower.includes('short eat')) return 'tapas';
    if (lower.includes('dessert') || lower.includes('sweet')) return 'cake';
    return 'restaurant_menu';
  };
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-stone-50 flex flex-col gap-2 p-4 border-r border-stone-200">
      <div className="mb-6 px-2">
        <h2 className="text-sm font-bold text-orange-900 uppercase tracking-widest font-['Plus_Jakarta_Sans']">
          Admin Panel
        </h2>
        <p className="text-xs text-stone-500">Menu Management</p>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        <Link
          to="/admin-dashboard"
          className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-orange-800 hover:bg-stone-200 transition-all rounded-lg"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-bold">Dashboard</span>
        </Link>
        <Link
          to="/kitchen-room"
          className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-orange-800 hover:bg-stone-200 transition-all rounded-lg"
        >
          <span className="material-symbols-outlined">countertops</span>
          <span className="font-bold">Kitchen</span>
        </Link>
        <Link
          to="/admin-time-slots"
          className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-orange-800 hover:bg-stone-200 transition-all rounded-lg"
        >
          <span className="material-symbols-outlined">schedule</span>
          <span className="font-bold">Time Slots</span>
        </Link>
      </div>

      <div className="px-2 mb-2">
        <p className="text-[10px] text-stone-400 uppercase font-black">Categories</p>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto">
        {categories.length > 0 ? (
          categories.map((cat, i) => (
            <a
              key={cat._id || i}
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:text-orange-800 hover:bg-stone-200 transition-all rounded-lg"
            >
              <span className="material-symbols-outlined">{getCategoryIcon(cat.name)}</span>
              <span className="font-medium">{cat.name}</span>
            </a>
          ))
        ) : (
          <div className="px-4 py-3 text-stone-400 text-sm italic">Loading categories...</div>
        )}
      </nav>

      <div className="mt-auto p-2">
        <button 
          onClick={onAddItem}
          className="w-full py-3 bg-gradient-to-br from-[#a43700] to-[#7c2800] rounded-lg text-white font-bold shadow-lg shadow-[#7c2800]/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Item
        </button>
      </div>
    </aside>
  );
};

export default SideNavAdmin;