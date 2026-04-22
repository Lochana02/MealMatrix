import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../../components/Topbar";
import SideNavAdmin from "../../components/sideNavAdmin";

const KitchenRoom = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("mm_token");

      const res = await axios.get(`${apiBaseUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderList = res.data.orders || [];

      const sortedOrders = orderList.sort((a, b) => {
        if (!a.pickupTime) return 1;
        if (!b.pickupTime) return -1;
        return a.pickupTime.localeCompare(b.pickupTime);
      });

      const activeOrders = sortedOrders.filter(
        (o) => o.status !== "Delivered" && o.status !== "Cancelled"
      );

      setOrders(activeOrders);
    } catch (err) {
      console.error("Error fetching kitchen orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-100">
      <Topbar title="Kitchen Display System" />

      <div className="flex">
        <SideNavAdmin />

        <main className="flex-1 ml-64 pt-20 p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black text-stone-900">
                Kitchen Room
              </h1>
              <p className="text-stone-500">
                View-only kitchen monitoring system
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-white rounded-lg border border-stone-200 shadow-sm hover:bg-stone-50 text-stone-600 font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                refresh
              </span>
              Refresh
            </button>
          </div>

          {/* LOADING */}
          {loading && orders.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-800"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* EMPTY STATE */}
              {orders.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl p-12 text-center border-2 border-dashed border-stone-200 text-stone-400">
                  <span className="material-symbols-outlined text-5xl mb-4">
                    check_circle
                  </span>
                  <p className="text-xl font-bold">No pending orders!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col"
                  >
                    {/* HEADER */}
                    <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-stone-400">
                          Order ID
                        </span>
                        <h3 className="font-bold text-stone-800">
                          {order.orderId}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase text-orange-900">
                          Pickup Time
                        </span>
                        <p className="text-lg font-black text-orange-800">
                          {order.pickupTime || "ASAP"}
                        </p>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="p-4 flex-1">
                      <ul className="space-y-2">
                        {order.orderedItems.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center"
                          >
                            <span className="text-stone-700 font-medium">
                              <span className="bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded mr-2 text-xs font-bold">
                                {item.quantity}
                              </span>
                              {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* VIEW ONLY FOOTER */}
                    <div className="p-4 bg-stone-50 border-t border-stone-200">
                      <div className="text-center text-xs font-bold uppercase tracking-widest text-stone-500 bg-stone-100 py-2 rounded-lg">
                        View Only Mode
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default KitchenRoom;