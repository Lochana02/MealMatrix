import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const URL = `${apiBaseUrl}/time-slots`;

// 🔥 MAIN MEAL TIMES
const mainMeals = ["Breakfast", "Lunch"];
const otherCategories = ["Other"];

const mealTimes = {
  Breakfast: { start: "07:00", end: "11:30", label: "7.00 AM - 11.30 AM" },
  Lunch: { start: "12:00", end: "15:30", label: "12.00 PM - 3.30 PM" }
};

// 🔥 ALL OPTIONS
const mealOptions = [...mainMeals, ...otherCategories];

function TimeSlot() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mealType: "Breakfast",
    pickupStartTime: "",
    pickupEndTime: "",
    maxOrders: "",
    date: ""
  });

  const [editingId, setEditingId] = useState(null);

  // Stats calculations
  const totalSlots = slots.length;
  const totalCapacity = slots.reduce((sum, slot) => sum + (slot.maxOrders || 0), 0);
  const activeSlots = slots.filter(slot => slot.status !== "Inactive").length;
  const availableSlots = slots.filter(slot => slot.status === "Available").length;

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("mm_token");
      const response = await axios.get(URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSlots(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🔥 VALIDATION
  const isWithinRange = (start, end, mealType) => {
    if (!mealTimes[mealType]) return true;
    const allowed = mealTimes[mealType];
    return start >= allowed.start && end <= allowed.end;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.pickupStartTime || !form.pickupEndTime || !form.maxOrders || !form.date) {
      alert("Please fill all fields!");
      return;
    }

    if (form.maxOrders <= 0) {
      alert("Max orders must be greater than 0");
      return;
    }

    if (form.pickupStartTime >= form.pickupEndTime) {
      alert("End time must be after start time");
      return;
    }

    if (!isWithinRange(form.pickupStartTime, form.pickupEndTime, form.mealType)) {
      alert(`${form.mealType} must be within ${mealTimes[form.mealType].label}`);
      return;
    }

    try {
      const token = localStorage.getItem("mm_token");
      if (editingId) {
        await axios.put(`${URL}/${editingId}`, form, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Updated successfully!");
        setEditingId(null);
      } else {
        await axios.post(URL, form, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert("Added successfully!");
      }

      setForm({
        mealType: "Breakfast",
        pickupStartTime: "",
        pickupEndTime: "",
        maxOrders: "",
        date: ""
      });

      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 EDIT
  const handleEdit = (slot) => {
    setEditingId(slot._id);
    setForm({
      mealType: slot.mealType,
      pickupStartTime: slot.pickupStartTime,
      pickupEndTime: slot.pickupEndTime,
      maxOrders: slot.maxOrders,
      date: slot.date.split('T')[0]
    });
  };

  // 🔥 CANCEL EDIT
  const handleCancel = () => {
    setEditingId(null);
    setForm({
      mealType: "Breakfast",
      pickupStartTime: "",
      pickupEndTime: "",
      maxOrders: "",
      date: ""
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this slot?")) {
      try {
        const token = localStorage.getItem("mm_token");
        await axios.delete(`${URL}/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchSlots();
        alert("Deleted successfully!");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleViewDetails = (slot) => {
    navigate("/notification", { state: { slot } });
  };

  const generateReport = () => {
    window.print();
  };

  // 🔍 SEARCH FUNCTION
  const filteredSlots = slots.filter(slot => {
    const matchesSearch = searchTerm === "" || 
      slot.mealType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.pickupStartTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.pickupEndTime?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (slot.maxOrders?.toString().includes(searchTerm)) ||
      (slot.status?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filter === "all" ||
      (filter === "active" && slot.status !== "Inactive") ||
      (filter === "available" && slot.status === "Available");

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f2eee4] flex items-center justify-center text-stone-600">Loading time slots...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f2eee4] text-[#2f2f2f] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f7f5ef] border-r border-stone-200 px-6 py-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#7d290f] italic mb-8">The MealMatrix Canteen</h2>
          <div className="mb-8 bg-[#f3ede1] rounded-xl p-3">
            <div className="font-semibold leading-tight text-[#8f2f12]">Time Slot</div>
            <div className="font-semibold leading-tight text-[#8f2f12]">Management</div>
            <div className="text-xs text-stone-500">Schedule & Capacity</div>
          </div>
          <nav className="space-y-1 text-sm">
            <div className="px-3 py-2 rounded-lg text-stone-500">Dashboard</div>
            <div className="px-3 py-2 rounded-lg bg-[#efe4d4] text-[#8f2f12] font-semibold">Time Slots</div>
          </nav>
          <button
            onClick={generateReport}
            className="mt-8 w-full bg-[#c44d0f] hover:bg-[#ad430c] text-white py-3 rounded-lg font-semibold"
          >
            Generate Report
          </button>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('mm_token');
            navigate('/login');
          }}
          className="text-left text-sm text-stone-500 px-2"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-start mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-5xl font-extrabold text-stone-900">Time Slot Ledger</h1>
            <p className="text-stone-600 mt-2 text-xl max-w-3xl">
              Manage pickup time slots and order capacity.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="bg-[#0b3155] hover:bg-[#0a2a49] text-white px-6 py-3 rounded-xl font-semibold"
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Total Slots</p>
            <p className="text-4xl font-extrabold text-[#8f2f12] mt-1">{totalSlots}</p>
          </div>
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Total Capacity</p>
            <p className="text-4xl font-extrabold text-[#154d9b] mt-1">{totalCapacity}</p>
          </div>
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Active Slots</p>
            <p className="text-4xl font-extrabold text-green-700 mt-1">{activeSlots}</p>
          </div>
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Available</p>
            <p className="text-4xl font-extrabold text-yellow-600 mt-1">{availableSlots}</p>
          </div>
        </div>

        {/* Fixed Times Info */}
        <div className="bg-[#f7f3e8] border border-stone-200 rounded-2xl p-5 mb-6">
          <h3 className="text-lg font-bold text-[#8f2f12] mb-3">Main Meal Time Ranges</h3>
          <div className="flex gap-6 flex-wrap text-stone-700">
            <span>🍳 Breakfast: {mealTimes.Breakfast.label}</span>
            <span>🍱 Lunch: {mealTimes.Lunch.label}</span>
            <span>⏰ Other categories → Available anytime</span>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-[#f7f3e8] border border-stone-200 rounded-2xl p-5 mb-6">
          <h3 className="text-xl font-bold text-stone-900 mb-4">
            {editingId ? "✏️ Edit Time Slot" : "➕ Add New Time Slot"}
          </h3>
          <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
            <select
              value={form.mealType}
              onChange={(e) => setForm({ ...form, mealType: e.target.value })}
              className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none"
            >
              {mealOptions.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <input
              type="time"
              value={form.pickupStartTime}
              onChange={(e) => setForm({ ...form, pickupStartTime: e.target.value })}
              placeholder="Start Time"
              className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none"
              required
            />

            <input
              type="time"
              value={form.pickupEndTime}
              onChange={(e) => setForm({ ...form, pickupEndTime: e.target.value })}
              placeholder="End Time"
              className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none"
              required
            />

            <input
              type="number"
              placeholder="Max Orders"
              value={form.maxOrders}
              onChange={(e) => setForm({ ...form, maxOrders: e.target.value })}
              className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none w-32"
              required
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none"
              required
            />

            <button
              type="submit"
              className="bg-[#c44d0f] hover:bg-[#ad430c] text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              {editingId ? "Update Slot" : "Add Slot"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-stone-400 hover:bg-stone-500 text-white px-6 py-2.5 rounded-xl font-semibold"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* 🔥🔥🔥 SEARCH AND FILTER - FIXED VERSION 🔥🔥🔥 */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-stone-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-stone-700 mb-2">🔍 Search Slots</label>
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Search by Meal Type, Date, Time, Orders, or Status..."
                  className="w-full bg-[#f7f3e8] border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-[#c44d0f] focus:ring-1 focus:ring-[#c44d0f] transition"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xl font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="text-xs text-stone-500 mt-1">
                  Found {filteredSlots.length} result(s) for "{searchTerm}"
                </p>
              )}
            </div>

            {/* Filter Buttons */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">📊 Filter by Status</label>
              <div className="flex gap-2">
                <button
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    filter === 'all' 
                      ? 'bg-[#c44d0f] text-white shadow-md' 
                      : 'bg-[#f7f3e8] border border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All ({slots.length})
                </button>
                <button
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    filter === 'active' 
                      ? 'bg-[#c44d0f] text-white shadow-md' 
                      : 'bg-[#f7f3e8] border border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                  onClick={() => setFilter('active')}
                >
                  Active ({activeSlots})
                </button>
                <button
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    filter === 'available' 
                      ? 'bg-[#c44d0f] text-white shadow-md' 
                      : 'bg-[#f7f3e8] border border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                  onClick={() => setFilter('available')}
                >
                  Available ({availableSlots})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots Table */}
        <div className="bg-[#f7f3e8] border border-stone-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-stone-600 uppercase text-xs bg-[#f2ecdf]">
                <tr>
                  <th className="text-left px-5 py-4">Slot ID</th>
                  <th className="text-left px-5 py-4">Meal Type</th>
                  <th className="text-left px-5 py-4">Date</th>
                  <th className="text-left px-5 py-4">Time Slot</th>
                  <th className="text-left px-5 py-4">Max Orders</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-right px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-stone-500">
                      {searchTerm ? `No time slots found matching "${searchTerm}"` : "No time slots found. Click 'Add Slot' to create one."}
                    </td>
                  </tr>
                ) : (
                  filteredSlots.map((slot, index) => (
                    <tr key={slot._id} className="border-t border-stone-200 hover:bg-stone-50 transition">
                      <td className="px-5 py-4 font-mono text-xs text-stone-500">SL-{String(index + 1).padStart(3, '0')}</td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-stone-800">{slot.mealType}</span>
                      </td>
                      <td className="px-5 py-4 text-stone-600">{formatDate(slot.date)}</td>
                      <td className="px-5 py-4 text-stone-600">{slot.pickupStartTime} - {slot.pickupEndTime}</td>
                      <td className="px-5 py-4 text-[#1f5ca9] font-semibold">{slot.maxOrders}</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          slot.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {slot.status || "Available"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(slot)}
                          className="text-[#1f5ca9] font-semibold mr-4 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(slot)}
                          className="text-yellow-600 font-semibold mr-4 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slot._id)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extra Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="md:col-span-2 bg-[#f7f3e8] border border-stone-200 rounded-2xl p-6">
            <h3 className="text-3xl font-bold text-stone-900 mb-3">Slot Insights</h3>
            <p className="text-stone-600 text-lg max-w-2xl">
              Total capacity is <strong>{totalCapacity}</strong> orders across {totalSlots} time slots.
              {searchTerm && filteredSlots.length > 0 && ` Currently showing ${filteredSlots.length} matching slots.`}
            </p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-6 border border-[#c44d0f] text-[#c44d0f] px-5 py-2 rounded-full font-semibold hover:bg-[#c44d0f] hover:text-white transition"
            >
              {searchTerm ? "Clear Search" : "Analyze Trends"}
            </button>
          </div>
          <div className="bg-[#145fb5] rounded-2xl p-6 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Slot Status</h3>
              <p className="text-base text-blue-100">
                {activeSlots} active slots out of {totalSlots} total.
              </p>
            </div>
            <button
              onClick={() => {
                setFilter('active');
                setSearchTerm('');
              }}
              className="mt-6 bg-white text-[#145fb5] py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              View Active Slots
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TimeSlot;