import React from "react";

const AdminSideNav = () => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-stone-50 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 hidden lg:flex flex-col justify-between">

      {/* Top Section */}
      <div>
        {/* Profile */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-200 flex items-center justify-center">
              <span className="material-symbols-outlined">
                admin_panel_settings
              </span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">
                Canteen Admin
              </p>
              <p className="text-xs text-stone-500">
                System Controller
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-3 text-sm">

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 bg-orange-100 text-orange-800 rounded-lg font-semibold"
          >
            <span className="material-symbols-outlined">category</span>
            Categories
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 rounded-lg transition"
          >
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 rounded-lg transition"
          >
            <span className="material-symbols-outlined">history</span>
            Logs
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 rounded-lg transition"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Archive
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 rounded-lg transition"
          >
            <span className="material-symbols-outlined">
              admin_panel_settings
            </span>
            Security
          </a>

        </nav>
      </div>

      {/* Bottom Status */}
      <div className="p-6">
        <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-xl text-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
          <p className="text-xs font-bold text-on-surface">
            System Status: Active
          </p>
        </div>
      </div>

    </aside>
  );
};

export default AdminSideNav;