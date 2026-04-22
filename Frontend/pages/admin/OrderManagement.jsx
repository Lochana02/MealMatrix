import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const starterOrders = [];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusBadge(status) {
  if (status === "Delivered") {
    return "bg-green-100 text-green-700";
  }
  if (status === "Processing") {
    return "bg-blue-100 text-blue-700";
  }
  return "bg-red-100 text-red-700";
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [orders, setOrders] = useState(starterOrders);
  const [showForm, setShowForm] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    customer: "",
    email: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    status: "Processing",
    items: "",
    total: "",
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem("mm_token");
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  };

  const handleAuthError = (statusCode) => {
    if (statusCode === 401) {
      // Temporarily bypassed for editing
      // localStorage.removeItem("mm_token");
      // localStorage.removeItem("mm_user");
      // delete axios.defaults.headers.common.Authorization;
      // setError("Session expired. Please login again as admin.");
      // navigate("/login", { replace: true });
      return false;
    }

    if (statusCode === 403) {
      setError("Only admin users can access this page.");
      return true;
    }

    return false;
  };

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiBaseUrl}/orders`, getAuthConfig());
      const apiOrders = Array.isArray(response.data?.orders) ? response.data.orders : [];
      const mapped = apiOrders.map((order) => {
        const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
        return {
          id: order.orderId || order._id,
          backendId: order.orderId || order._id,
          customer: order.name || "Unknown Customer",
          email: order.email || "",
          phone: order.phone || "",
          address: order.address || "",
          items: Array.isArray(order.orderedItems) ? order.orderedItems.map((item) => item.name).filter(Boolean) : [],
          status: order.status || "Pending",
          total: Number(order.totalAmount) || 0,
          date: createdAt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          rawDate: createdAt.toISOString().split("T")[0],
          time: createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        };
      });
      setOrders(mapped);
    } catch (err) {
      const statusCode = err.response?.status;
      if (!handleAuthError(statusCode)) {
        setError(err.response?.data?.message || "Failed to load orders");
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const itemText = order.items.join(" ").toLowerCase();
      return (
        String(order.id).toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        itemText.includes(query)
      );
    });
  }, [orders, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const deliveredCount = orders.filter((order) => order.status === "Delivered").length;
  const completionRate = orders.length
    ? ((deliveredCount / orders.length) * 100).toFixed(1)
    : "0.0";
  const totalVolume = orders.length.toLocaleString();
  const avgTicket = orders.length
    ? (orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toFixed(2)
    : "0.00";

  const resetForm = () => {
    setForm({
      customer: "",
      email: "",
      phone: "",
      address: "",
      date: "",
      time: "",
      status: "Processing",
      items: "",
      total: "",
    });
    setFormErrors({});
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });

    if (formErrors[event.target.name]) {
      setFormErrors((prev) => ({ ...prev, [event.target.name]: "" }));
    }
  };

  const validateForm = () => {
    // Validations bypassed for development
    return {};
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const items = form.items.split(",").map((item) => item.trim()).filter(Boolean);
    const orderedItems = items.map((item, index) => ({
      itemType: "service",
      itemId: `ITEM-${Date.now()}-${index + 1}`,
      name: item,
      price: Number(form.total) / Math.max(items.length, 1),
      quantity: 1,
      image: "",
    }));

    const payload = {
      name: form.customer,
      customer: form.customer,
      email: form.email || undefined,
      phone: form.phone || "Not Provided",
      address: form.address || "Not Provided",
      status: form.status,
      items,
      orderedItems,
      totalAmount: Number(form.total),
    };

    try {
      setError("");
      setSaving(true);

      if (editingOrderId) {
        await axios.put(`${apiBaseUrl}/orders/${editingOrderId}`, payload, getAuthConfig());
      } else {
        await axios.post(`${apiBaseUrl}/orders`, payload, getAuthConfig());
      }

      await loadOrders();
      setShowForm(false);
      setEditingOrderId(null);
      resetForm();
    } catch (err) {
      const statusCode = err.response?.status;
      if (!handleAuthError(statusCode)) {
        setError(err.response?.data?.message || "Failed to save order");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (indexOnPage) => {
    const order = pagedOrders[indexOnPage];

    setEditingOrderId(order.backendId);
    setForm({
      customer: order.customer,
      email: order.email,
      phone: order.phone,
      address: order.address,
      date: order.rawDate || "",
      time: order.time,
      status: order.status,
      items: order.items.join(", "),
      total: String(order.total),
    });
    setShowForm(true);
  };

  const handleDelete = async (indexOnPage) => {
    const order = pagedOrders[indexOnPage];

    try {
      setError("");
      await axios.delete(`${apiBaseUrl}/orders/${order.backendId}`, getAuthConfig());
      await loadOrders();
    } catch (err) {
      const statusCode = err.response?.status;
      if (!handleAuthError(statusCode)) {
        setError(err.response?.data?.message || "Failed to delete order");
      }
    }
  };

  const generateReport = () => {
    const headers = ["Date", "Time", "Order ID", "Customer", "Items", "Status", "Total"];
    const lines = orders.map((order) => {
      const items = order.items.join(" | ");
      return [order.date, order.time, order.id, order.customer, items, order.status, order.total.toFixed(2)]
        .map((value) => `"${value}"`)
        .join(",");
    });

    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "order-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f2eee4] text-[#2f2f2f] flex">
      <aside className="w-64 bg-[#f7f5ef] border-r border-stone-200 px-6 py-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#7d290f] italic mb-8">The Editorial Canteen</h2>

          <div className="mb-8 bg-[#f3ede1] rounded-xl p-3">
            <div className="font-semibold leading-tight text-[#8f2f12]">Kitchen</div>
            <div className="font-semibold leading-tight text-[#8f2f12]">Command</div>
            <div className="text-xs text-stone-500">Central Hub</div>
          </div>

          <nav className="space-y-1 text-sm">
            <div className="px-3 py-2 rounded-lg text-stone-500">Dashboard</div>
            <div className="px-3 py-2 rounded-lg bg-[#efe4d4] text-[#8f2f12] font-semibold">Orders</div>
            <div className="px-3 py-2 rounded-lg text-stone-500">Menu Editor</div>
            <div className="px-3 py-2 rounded-lg text-stone-500">Inventory</div>
            <div className="px-3 py-2 rounded-lg text-stone-500">Staff</div>
          </nav>

          <button
            onClick={generateReport}
            className="mt-8 w-full bg-[#c44d0f] hover:bg-[#ad430c] text-white py-3 rounded-lg font-semibold"
          >
            Generate Report
          </button>
        </div>

        <button className="text-left text-sm text-stone-500 px-2">Logout</button>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-5xl font-extrabold text-stone-900">Order History</h1>
            <p className="text-stone-600 mt-2 text-xl max-w-3xl">
              Detailed ledger of culinary transactions and kitchen performance.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingOrderId(null);
              resetForm();
              setShowForm(true);
            }}
            className="bg-[#0b3155] hover:bg-[#0a2a49] text-white px-6 py-3 rounded-xl font-semibold"
          >
            + Add Order
          </button>
        </header>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Total Volume</p>
            <p className="text-4xl font-extrabold text-[#8f2f12] mt-1">{totalVolume}</p>
            <p className="text-xs text-green-700 mt-1">+12% vs LW</p>
          </div>
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Completion Rate</p>
            <p className="text-4xl font-extrabold text-[#154d9b] mt-1">{completionRate}%</p>
          </div>
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Avg. Ticket</p>
            <p className="text-4xl font-extrabold text-stone-900 mt-1">LKR {avgTicket}</p>
          </div>
          <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
            <p className="text-xs uppercase tracking-wide text-stone-500">Delivered Today</p>
            <p className="text-4xl font-extrabold text-green-700 mt-1">{deliveredCount}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-[420px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-500">search</span>
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search by Order # or Customer..."
              className="w-full bg-[#f7f3e8] border border-stone-200 rounded-xl pl-10 pr-3 py-2.5 outline-none"
            />
          </div>

          <button className="bg-[#f7f3e8] border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-semibold">
            Advanced Filters
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-[#f7f3e8] border border-stone-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-stone-600 uppercase text-xs bg-[#f2ecdf]">
              <tr>
                <th className="text-left px-5 py-4">Date</th>
                <th className="text-left px-5 py-4">Order #</th>
                <th className="text-left px-5 py-4">Customer</th>
                <th className="text-left px-5 py-4">Items</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-left px-5 py-4">Total</th>
                <th className="text-right px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && pagedOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-stone-500">
                    No orders available yet.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-stone-500">
                    Loading orders...
                  </td>
                </tr>
              )}

              {pagedOrders.map((order, index) => (
                <tr key={order.id} className="border-t border-stone-200">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-stone-800">{order.date}</div>
                    <div className="text-xs text-stone-500">{order.time}</div>
                  </td>
                  <td className="px-5 py-4 text-[#1f5ca9] font-semibold">{order.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-200 text-xs font-bold flex items-center justify-center">
                        {getInitials(order.customer)}
                      </div>
                      <span className="font-semibold text-stone-800">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-stone-600 italic leading-5">
                    {order.items.join(", ")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold">LKR {order.total.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-[#1f5ca9] font-semibold mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(index);
                      }}
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center px-5 py-4 border-t border-stone-200 text-sm text-stone-600">
            <span>
              Showing {(page - 1) * pageSize + (pagedOrders.length ? 1 : 0)} - {(page - 1) * pageSize + pagedOrders.length} of {filteredOrders.length} orders
            </span>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-md border border-stone-200"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`w-8 h-8 rounded-md border ${
                    page === index + 1
                      ? "bg-[#c44d0f] text-white border-[#c44d0f]"
                      : "border-stone-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="w-8 h-8 rounded-md border border-stone-200"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-8">
          <div className="col-span-2 bg-[#f7f3e8] border border-stone-200 rounded-2xl p-6">
            <h3 className="text-3xl font-bold text-stone-900 mb-3">Peak Hour Performance</h3>
            <p className="text-stone-600 text-lg max-w-2xl">
              Your kitchen is handling maximum load between 12:00 PM and 1:30 PM.
              Order accuracy remains high at 99.1%.
            </p>
            <button className="mt-6 border border-[#c44d0f] text-[#c44d0f] px-5 py-2 rounded-full font-semibold">
              Analyze Velocity
            </button>
          </div>

          <div className="bg-[#145fb5] rounded-2xl p-6 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Smart Inventory Link</h3>
              <p className="text-base text-blue-100">
                Orders are automatically depleting your stock levels. 3 items are approaching threshold.
              </p>
            </div>
            <button className="mt-6 bg-white text-[#145fb5] py-2.5 rounded-lg font-semibold">
              Review Inventory
            </button>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[520px] p-6 shadow-xl">
            <h2 className="text-4xl font-bold mb-5">
              {editingOrderId ? "Edit Order" : "Add Order"}
            </h2>

            <div className="space-y-3">
              <input
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="Customer Name"
                className={`w-full border rounded-lg p-3 ${formErrors.customer ? "border-red-400" : "border-stone-300"}`}
              />
              {formErrors.customer && <p className="text-xs text-red-600">{formErrors.customer}</p>}
              
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border rounded-lg p-3 border-stone-300"
              />
              
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border rounded-lg p-3 border-stone-300"
              />
              
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Delivery Address"
                className="w-full border rounded-lg p-3 border-stone-300"
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full border rounded-lg p-3 ${formErrors.date ? "border-red-400" : "border-stone-300"}`}
              />
              {formErrors.date && <p className="text-xs text-red-600">{formErrors.date}</p>}
              <input
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="12:45 PM"
                className={`w-full border rounded-lg p-3 ${formErrors.time ? "border-red-400" : "border-stone-300"}`}
              />
              {formErrors.time && <p className="text-xs text-red-600">{formErrors.time}</p>}
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${formErrors.status ? "border-red-400" : "border-stone-300"}`}
              >
                <option>Delivered</option>
                <option>Processing</option>
                <option>Cancelled</option>
              </select>
              {formErrors.status && <p className="text-xs text-red-600">{formErrors.status}</p>}
              <input
                name="items"
                value={form.items}
                onChange={handleChange}
                placeholder="Item 1, Item 2"
                className={`w-full border rounded-lg p-3 ${formErrors.items ? "border-red-400" : "border-stone-300"}`}
              />
              {formErrors.items && <p className="text-xs text-red-600">{formErrors.items}</p>}
              <input
                name="total"
                type="number"
                step="0.01"
                value={form.total}
                onChange={handleChange}
                placeholder="Total"
                className={`w-full border rounded-lg p-3 ${formErrors.total ? "border-red-400" : "border-stone-300"}`}
              />
              {formErrors.total && <p className="text-xs text-red-600">{formErrors.total}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingOrderId(null);
                  resetForm();
                }}
                className="px-4 py-2.5 bg-stone-200 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSubmit();
                }}
                disabled={saving}
                className="px-6 py-2.5 bg-[#145fb5] text-white rounded-lg font-semibold"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}