import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    navigate("/login");
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm shadow-orange-900/5 flex justify-between items-center px-8 h-20">
        <div className="text-2xl font-bold tracking-tighter text-orange-800 dark:text-orange-400">
          The Editorial Canteen
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => navigate("/adminMenu")}
            className="font-headline text-sm uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-600 hover:opacity-80 transition-opacity"
          >
            Menu
          </button>
          <button
            onClick={() => navigate("/Order")}
            className="font-headline text-sm uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-600 hover:opacity-80 transition-opacity"
          >
            Orders
          </button>
          <button
            onClick={() => navigate("/category")}
            className="font-headline text-sm uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-600 hover:opacity-80 transition-opacity"
          >
            Categories
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-highest rounded-full px-4 py-2 hidden lg:flex items-center gap-2 border border-slate-200">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-on-surface-variant focus:outline-none"
              placeholder="Search insights..."
              type="text"
            />
          </div>
          <button className="material-symbols-outlined p-2 text-slate-500 hover:text-orange-600 transition-colors">
            notifications
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="material-symbols-outlined p-2 text-slate-500 hover:text-orange-600 transition-colors"
            >
              account_circle
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 pt-24 bg-slate-50 dark:bg-slate-950 flex flex-col gap-2 z-40 hidden md:flex border-r border-slate-200">
        <div className="px-6 mb-8">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Admin Portal
          </h2>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
            Culinary Concierge
          </p>
        </div>
        <nav className="flex flex-col gap-2 px-2">
          <button 
            className="font-manrope text-sm font-medium bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-400 shadow-sm rounded-r-xl p-4 mr-4 flex items-center gap-3 text-left transition-all hover:bg-slate-100"
            onClick={() => navigate("/admin-dashboard")}
          >
            <span className="material-symbols-outlined">monitoring</span>
            Analytics
          </button>
          <button 
            className="font-manrope text-sm font-medium text-slate-600 dark:text-slate-400 p-4 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-transform flex items-center gap-3 rounded-r-xl mr-4 text-left"
            onClick={() => navigate("/adminMenu")}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Kitchen
          </button>
          <button 
            className="font-manrope text-sm font-medium text-slate-600 dark:text-slate-400 p-4 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-transform flex items-center gap-3 rounded-r-xl mr-4 text-left"
            onClick={() => navigate("/admin-payment")}
          >
            <span className="material-symbols-outlined">payments</span>
            Payments
          </button>
          <button 
             className="font-manrope text-sm font-medium text-slate-600 dark:text-slate-400 p-4 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-transform flex items-center gap-3 rounded-r-xl mr-4 text-left"
             onClick={() => navigate("/admin-feedback")}
          >
            <span className="material-symbols-outlined">rate_review</span>
            Customer Feedback
          </button>
        </nav>
        <div className="mt-auto p-6">
          <button className="bg-orange-600 hover:bg-orange-700 text-white w-full py-4 rounded-lg font-bold shadow-lg shadow-orange-900/20 active:scale-95 transition-transform">
            Generate Report
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-24 min-h-screen pb-12">
        <div className="px-8 py-12 max-w-7xl mx-auto space-y-12">
          {/* Hero Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-orange-700 font-bold uppercase tracking-[0.2em] text-xs">
                Executive Dashboard
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight text-on-surface">
                Heirloom Ledger Overview
              </h1>
            </div>
            <div className="flex items-center gap-4 bg-orange-50 p-2 rounded-xl">
              <button className="bg-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm">
                Last 7 Days
              </button>
              <button className="px-6 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-orange-100 transition-colors">
                Month
              </button>
            </div>
          </header>

          {/* Key Metrics Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-green-700 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">
                  +12.4%
                </span>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm">Total Sales</p>
                <p className="text-4xl font-extrabold tracking-tight mt-1">
                  LKR 42,904.00
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl space-y-6 border-2 border-orange-600/10 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <span className="material-symbols-outlined">
                    shopping_basket
                  </span>
                </div>
                <span className="text-green-600 font-bold text-sm">Live</span>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm">
                  Active Orders
                </p>
                <p className="text-4xl font-extrabold tracking-tight mt-1">128</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
                  <span className="material-symbols-outlined">
                    health_and_safety
                  </span>
                </div>
                <span className="text-red-600 font-bold text-sm bg-red-100 px-3 py-1 rounded-full">
                  4 Alerts
                </span>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm">
                  Inventory Health
                </p>
                <p className="text-4xl font-extrabold tracking-tight mt-1">94%</p>
              </div>
            </div>
          </section>

          {/* Main Data Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sales Performance Chart (Visual Representation) */}
            <div className="lg:col-span-8 bg-white p-8 rounded-3xl space-y-8 min-h-[450px] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold tracking-tight">
                  Sales Performance
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-600"></span>
                    <span className="text-xs font-semibold text-slate-500">
                      Gross Sales
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span className="text-xs font-semibold text-slate-500">
                      Forecast
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-slate-100 pb-2">
                {[
                  { day: "Mon", h: "h-32", fill: "h-2/3" },
                  { day: "Tue", h: "h-32", fill: "h-3/4" },
                  { day: "Wed", h: "h-32", fill: "h-1/2" },
                  { day: "Thu", h: "h-32", fill: "h-full" },
                  { day: "Fri", h: "h-32", fill: "h-4/5" },
                  { day: "Sat", h: "h-32", fill: "h-2/5" },
                  { day: "Sun", h: "h-32", fill: "h-1/4" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-4 group"
                  >
                    <div className={`w-full bg-slate-50 rounded-t-xl relative ${item.h} transition-all duration-300 group-hover:bg-slate-100`}>
                      <div className={`absolute bottom-0 w-full bg-orange-600 rounded-t-xl ${item.fill}`}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts Sidecard */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight">
                    Inventory Alerts
                  </h3>
                  <span className="material-symbols-outlined text-red-600">
                    warning
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          alt="Tomatoes"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA0csJMrXi3ldqhW-Ibmdb0Aa_FZDCgKL3r0NvPrNLhSrUrZj0AaTKy8gDSpkxke4u7h9whQPOtDKxQEWV_zi_4ewDn0XVJV4yv6nTFAcMhJGJkOI-VodAqC1C0D3Fgd3WFMuqiKLxNzoZxRsm4nbxmIfNCbLiC_fGVHX7ygZz6Lp6hw3h1PcJT5q4TIEUxXrSHck7-GmdZoD86Z4sr4XohRWfiiTR-2FUSDRu0W0Bey58dwE4vbWPjLls6AULhUSJcJnLrPQ3KJ2M"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Vine Tomatoes</p>
                        <p className="text-red-600 text-xs font-semibold">
                          2.4kg remaining
                        </p>
                      </div>
                    </div>
                    <button className="text-orange-700 text-xs font-bold underline">
                      Reorder
                    </button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          alt="Flour"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtK8LeH-JXVdpyTSv_oTQWsdT2UFO5UCjssCN8OMfmDQQkk00O_AY6ValUJA0xgb951mdtAUSAaSXbgwIZLLt0Tk9jwY0N-WxnVCcpaNrXjuymQh2SQJDgVR2TlgpJEsqGeLiB7KYG91hI-w6Yk6Qb15JwrJd7Ya8OBvN_4raXfnryDHmGr3fjA_jTzs4PjcczlKLuwOEKCRpXQ-gJmTlIRT9lttstwxL1zcQ6JIdYYbxlgMX-vC2sVZdbW1hLt7wjv1YmvlCbf3wV"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Artisan Flour</p>
                        <p className="text-red-600 text-xs font-semibold">
                          Low Stock: 5kg
                        </p>
                      </div>
                    </div>
                    <button className="text-orange-700 text-xs font-bold underline">
                      Reorder
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Promo/Action */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-8 rounded-3xl text-white space-y-4 relative overflow-hidden shadow-lg shadow-orange-900/20">
                <div className="relative z-10">
                  <h4 className="text-lg font-bold">Kitchen Capacity</h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Current load is at 85%. Consider slowing digital order flow to maintain quality.
                  </p>
                  <button className="mt-4 bg-white text-orange-700 px-6 py-2 rounded-full text-sm font-bold shadow-xl active:scale-95 transition-all">
                    Manage Flow
                  </button>
                </div>
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 scale-150">
                  restaurant
                </span>
              </div>
            </div>
          </section>

          {/* Recent Orders Section */}
          <section className="bg-white p-8 rounded-3xl space-y-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-tight">Recent Orders</h3>
              <button 
                onClick={() => navigate("/Order")}
                className="text-orange-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
              >
                View History{" "}
                <span className="material-symbols-outlined text-sm font-bold">
                  arrow_forward
                </span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-slate-500 text-xs uppercase tracking-widest font-bold">
                    <th className="px-4 pb-4">Order ID</th>
                    <th className="px-4 pb-4">Customer</th>
                    <th className="px-4 pb-4">Items</th>
                    <th className="px-4 pb-4">Amount</th>
                    <th className="px-4 pb-4">Status</th>
                    <th className="px-4 pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {[
                    { id: "#HL-9042", name: "Elena Mitchell", initial: "EM", items: "3 Items", price: "LKR 4,250", status: "Ready", color: "bg-green-100 text-green-700" },
                    { id: "#HL-9041", name: "James Randal", initial: "JR", items: "1 Item", price: "LKR 1,820", status: "Preparing", color: "bg-slate-100 text-slate-500" },
                    { id: "#HL-9040", name: "Alice Lawson", initial: "AL", items: "5 Items", price: "LKR 8,900", status: "Delivered", color: "bg-orange-100 text-orange-700" },
                  ].map((order, idx) => (
                    <tr
                      key={idx}
                      className="bg-slate-50 rounded-2xl group hover:shadow-md transition-all hover:bg-white border border-transparent hover:border-slate-200"
                    >
                      <td className="px-4 py-6 rounded-l-2xl font-bold text-sm">
                        {order.id}
                      </td>
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-600 text-[10px] flex items-center justify-center text-white font-bold">
                            {order.initial}
                          </div>
                          <span className="font-semibold text-sm">
                            {order.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-sm text-slate-500">
                        {order.items}
                      </td>
                      <td className="px-4 py-6 font-bold text-sm">
                        {order.price}
                      </td>
                      <td className="px-4 py-6">
                        <span className={`${order.color} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-6 rounded-r-2xl text-right">
                        <button className="material-symbols-outlined text-slate-400 hover:text-orange-600 transition-colors">
                          more_horiz
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Contextual FAB */}
      <button 
        onClick={() => navigate("/adminMenu")}
        className="fixed bottom-8 right-8 bg-orange-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 group active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined font-bold">add</span>
        <span className="font-bold pr-2 hidden group-hover:block whitespace-nowrap">
          New Item
        </span>
      </button>
    </div>
  );
};

export default AdminDashboard;
