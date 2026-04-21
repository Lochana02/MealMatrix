import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryManagement() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    items: "",
    status: "Active",
  });

  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiBaseUrl}/categories`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      items: Number(formData.items) || 0,
      status: formData.status,
    };

    try {
      setError("");

      if (editCategoryId) {
        await axios.put(`${apiBaseUrl}/categories/${editCategoryId}`, payload);
      } else {
        await axios.post(`${apiBaseUrl}/categories`, payload);
      }

      await loadCategories();
      setEditCategoryId(null);
      setShowForm(false);
      setFormData({
        name: "",
        description: "",
        items: "",
        status: "Active",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await axios.delete(`${apiBaseUrl}/categories/${id}`);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name || "",
      description: category.description || "",
      items: category.items ?? "",
      status: category.status || "Active",
    });
    setEditCategoryId(category._id);
    setShowForm(true);
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed min-h-screen">
      {/* TopNavBar */}
      <nav className="w-full sticky top-0 z-50 bg-orange-50/80 backdrop-blur-xl shadow-sm shadow-orange-900/5">
        <div className="flex justify-between items-center px-8 py-4 w-full">
          <div className="text-2xl font-black italic text-orange-900">
            The Editorial Canteen
          </div>
          <div className="hidden md:flex items-center space-x-8 font-plus-jakarta text-sm uppercase tracking-widest text-orange-800/70">
            <a className="text-orange-900 font-bold border-b-2 border-orange-600" href="#">
              Inventory
            </a>
            <a className="hover:bg-orange-100/50 transition-colors px-3 py-1 rounded" href="#">
              Orders
            </a>
            <a className="hover:bg-orange-100/50 transition-colors px-3 py-1 rounded" href="#">
              Menu
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="material-symbols-outlined p-2 text-orange-800 hover:bg-orange-100/50 rounded-full transition-colors active:scale-95 duration-200">
              notifications
            </button>
            <button className="material-symbols-outlined p-2 text-orange-800 hover:bg-orange-100/50 rounded-full transition-colors active:scale-95 duration-200">
              settings
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest border-2 border-primary-container">
              <img
                alt="Admin Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYhwYWGIpY9j8XcTFU3JQ80WC20bscrqj-vAmVjD91ZTuZ6QLfMa8SpvfzFPoKIIl7SuOnRtcOPt5vdv9pekmjlGZFXWj_9ebM66B6TzGSfwrqKT4wUIwAEVWv_qD3mDPyBQ9e4AfFTuel0Vy42nLBxt1DNdSolxXQkFQi9GcfrIm2j9CP3yl126K5XL3EgX-2_EAul_Cs5jN_kOart-kCA0RtTW3yXh-broId5yrEwWFYxIlzggrxJK361T3NGsNp2RzBakP9w1o"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* SideNavBar */}
        <aside className="h-screen w-64 sticky left-0 top-[72px] bg-stone-50 flex flex-col py-6 space-y-4 shadow-sm shadow-orange-900/5 border-r border-stone-200">
          <div className="px-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container">
                  restaurant_menu
                </span>
              </div>
              <div>
                <p className="font-manrope text-sm font-semibold text-orange-700">
                  Management
                </p>
                <p className="text-[10px] uppercase tracking-tighter text-stone-500">
                  Culinary Concierge
                </p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <a
              className="flex items-center px-6 py-3 bg-orange-100 text-orange-900 rounded-lg mx-2 transition-all duration-300"
              href="#"
            >
              <span className="material-symbols-outlined mr-3">category</span>
              <span className="font-manrope text-sm font-semibold">Categories</span>
            </a>
            <a
              className="flex items-center px-6 py-3 text-stone-600 mx-2 hover:bg-stone-200 rounded-lg transition-all duration-300"
              href="#"
            >
              <span className="material-symbols-outlined mr-3">analytics</span>
              <span className="font-manrope text-sm font-semibold">Analytics</span>
            </a>
            <a
              className="flex items-center px-6 py-3 text-stone-600 mx-2 hover:bg-stone-200 rounded-lg transition-all duration-300"
              href="#"
            >
              <span className="material-symbols-outlined mr-3">history</span>
              <span className="font-manrope text-sm font-semibold">Logs</span>
            </a>
          </nav>
          {/* <div className="px-4 py-4">
            <button className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 active:scale-95 transition-all">
              <span className="material-symbols-outlined">add_circle</span>
              <span>New Entry</span>
            </button>
          </div> */}
          <div className="mt-auto border-t border-stone-200 pt-4 space-y-1">
            <a
              className="flex items-center px-6 py-3 text-stone-600 hover:bg-stone-200 rounded-lg mx-2 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined mr-3">help</span>
              <span className="font-manrope text-sm font-semibold">Support</span>
            </a>
            <a
              className="flex items-center px-6 py-3 text-error hover:bg-error-container/20 rounded-lg mx-2 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined mr-3">logout</span>
              <span className="font-manrope text-sm font-semibold">Sign Out</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-surface">
          {/* Header Section */}
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                Category Management
              </h1>
              <p className="text-on-surface-variant font-medium">
                Curate the culinary experience by organizing menu items into
                curated tiers.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-xl flex items-center space-x-2 hover:bg-secondary-fixed transition-colors"
            >
              <span className="material-symbols-outlined">playlist_add</span>
              <span>Add New Category</span>
            </button>
          </header>

          <div className="space-y-4">
            {error && (
              <div className="px-6 py-3 bg-error-container text-on-error-container rounded-xl text-sm font-bold shadow-sm">
                {error}
              </div>
            )}

            {/* FORM */}
            {showForm && (
              <div className="mb-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-lg">
                <h2 className="text-xl font-bold text-on-surface mb-6 font-headline">
                  {editCategoryId ? "Edit Category" : "Add Category"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-3">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Category Name</label>
                    <input
                      name="name"
                      placeholder="e.g. Desserts"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-b-2 border-outline focus:border-primary bg-surface p-3 outline-none text-on-surface"
                      required
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Description</label>
                    <input
                      name="description"
                      placeholder="e.g. Sweet treats and pastries"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border-b-2 border-outline focus:border-primary bg-surface p-3 outline-none text-on-surface"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 text-center">Items Count</label>
                    <input
                      name="items"
                      type="number"
                      placeholder="0"
                      value={formData.items}
                      onChange={handleChange}
                      className="w-full border-b-2 border-outline focus:border-primary bg-surface p-3 outline-none text-on-surface text-center font-mono font-bold"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border-b-2 border-outline focus:border-primary bg-surface p-3 outline-none text-on-surface"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex justify-end gap-3 pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditCategoryId(null);
                        setFormData({
                          name: "",
                          description: "",
                          items: "",
                          status: "Active",
                        });
                      }}
                      className="px-4 py-2 bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant font-bold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-colors shadow-md"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && (
              <div className="mt-4 px-6 py-8 bg-surface-container-low rounded-2xl text-center text-sm font-bold text-on-surface-variant animate-pulse tracking-widest uppercase">
                Loading categories...
              </div>
            )}

            {!loading && categories.length > 0 && (
              <>
                <div className="grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-[0.2em] font-black text-outline">
                  <div className="col-span-3">Category Name</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2 text-center">Items</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {categories.map((cat, index) => {
                  const colors = [
                    "bg-orange-100 text-primary",
                    "bg-blue-100 text-tertiary",
                    "bg-yellow-100 text-primary-container",
                    "bg-stone-200 text-on-surface",
                    "bg-red-100 text-error"
                  ];
                  const colorClass = colors[index % colors.length];

                  return (
                    <div
                      key={cat._id}
                      className="grid grid-cols-12 items-center px-6 py-5 bg-surface-container-low hover:bg-surface-container transition-colors rounded-2xl group"
                    >
                      <div className="col-span-3 flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center overflow-hidden`}>
                           <span className="material-symbols-outlined text-[32px]">restaurant</span>
                        </div>
                        <span className="font-bold text-lg text-on-surface">
                          {cat.name}
                        </span>
                      </div>

                      <div className="col-span-4 text-sm text-on-surface-variant italic">
                        {cat.description || "No description provided."}
                      </div>

                      <div className="col-span-2 text-center font-mono font-bold text-primary">
                        {cat.items || 0}
                      </div>

                      <div className="col-span-1">
                        <span className={`px-3 py-1 ${cat.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'} text-[10px] font-bold rounded-full uppercase tracking-tighter`}>
                          {cat.status || "Active"}
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 hover:bg-white rounded-lg text-tertiary transition-colors material-symbols-outlined"
                          title="Edit"
                        >
                          edit
                        </button>
                        <button
                          className="p-2 hover:bg-white rounded-lg text-outline transition-colors material-symbols-outlined"
                          title="Archive"
                        >
                          archive
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 hover:bg-error-container/30 rounded-lg text-error transition-colors material-symbols-outlined"
                          title="Delete"
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {!loading && categories.length === 0 && !showForm && (
              <div className="mt-4 px-6 py-12 bg-surface-container-low border border-dashed border-outline rounded-2xl text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">category</span>
                <p className="font-bold text-lg">No categories yet.</p>
                <p className="text-sm">Click "Add New Category" to formulate your menu.</p>
              </div>
            )}
          </div>

          {/* Recent Activity Section */}
          <section className="mt-20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-[2px] flex-1 bg-surface-container-highest"></div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-outline font-headline">
                System Logs & Activity
              </h2>
              <div className="h-[2px] flex-1 bg-surface-container-highest"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-surface-container-low p-6 rounded-2xl space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary-container/20 text-secondary rounded-lg">
                    <span className="material-symbols-outlined text-sm">update</span>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                    12 Mins Ago
                  </span>
                </div>
                <p className="text-sm font-bold text-on-surface leading-tight">
                  Admin updated category inventory.
                </p>
                <p className="text-xs text-on-surface-variant">
                  System reflection: Inventory synchronization complete.
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
                    <span className="material-symbols-outlined text-sm">add_box</span>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                    2 Hours Ago
                  </span>
                </div>
                <p className="text-sm font-bold text-on-surface leading-tight">
                  Database backups completed.
                </p>
                <p className="text-xs text-on-surface-variant">
                  All MealMatrix records safely stored off-site.
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                  </div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                    Yesterday
                  </span>
                </div>
                <p className="text-sm font-bold text-on-surface leading-tight">
                  Security audit for 'Admin' role successful.
                </p>
                <p className="text-xs text-on-surface-variant">
                  All management interfaces verified under culinary protocol.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}