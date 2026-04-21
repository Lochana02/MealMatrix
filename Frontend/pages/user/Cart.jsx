import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("ASAP");
  const [timeSlots, setTimeSlots] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("mm_token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(`${apiBaseUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Error fetching cart", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("mm_token");
        localStorage.removeItem("mm_user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    generateTimeSlots();
  }, [apiBaseUrl]);

  const generateTimeSlots = () => {
    const slots = ["ASAP"];
    const now = new Date();
    // Start from 30 minutes later
    let startTime = new Date(now.getTime() + 30 * 60000);
    
    // Round to next 15-minute interval
    const minutes = startTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    startTime.setMinutes(roundedMinutes);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    // Generate 5 slots
    for (let i = 0; i < 5; i++) {
      const timeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      slots.push(timeStr);
      startTime = new Date(startTime.getTime() + 15 * 60000);
    }
    setTimeSlots(slots);
  };

  const syncCartWithServer = async (newCart) => {
    try {
      const token = localStorage.getItem("mm_token");
      await axios.put(`${apiBaseUrl}/cart`, { items: newCart }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Error updating cart", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("mm_token");
        localStorage.removeItem("mm_user");
        navigate("/login");
      }
    }
  };

  const increaseQty = (id) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    setCart(newCart);
    syncCartWithServer(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cart.map(item =>
      item.id === id
        ? { ...item, qty: item.qty - 1 }
        : item
    ).filter(item => item.qty > 0);
    setCart(newCart);
    syncCartWithServer(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    syncCartWithServer(newCart);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const serviceFee = 2.5;
  const total = subtotal + serviceFee;

  return (
    <div className="relative min-h-screen flex justify-center">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')"
        }}
      ></div>

      {/* BLUR OVERLAY (50%) */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/50"></div>

      {/* ORIGINAL CONTENT */}
      <div className="relative bg-[#f5efe6] min-h-screen py-10 flex justify-center w-full">
        <div className="w-full max-w-xl">

          {/* TITLE */}
          <h1 className="text-3xl font-extrabold mb-1">Your Basket</h1>
          <p className="text-sm text-gray-500 mb-6">
            {cart.length === 0 ? "Your basket is empty" : `${cart.length} items selected`}
          </p>

          {/* ITEMS */}
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-10 bg-[#ebe3d5] rounded-xl text-gray-500">
                You haven't added any items yet.
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id}
                  className="flex items-center justify-between bg-[#ebe3d5] p-4 rounded-xl">

                  <div className="flex gap-4 items-center flex-1">
                    <img src={item.img}
                      className="w-16 h-16 rounded-lg object-cover" />

                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                      <p className="text-orange-800 font-semibold mt-1">
                        LKR {(Number(item.price)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-200 px-3 py-1 rounded-full">
                      <button onClick={() => decreaseQty(item.id)} className="w-5 h-5 flex items-center justify-center font-bold text-gray-700 hover:text-orange-800">-</button>
                      <span className="font-semibold w-4 text-center">{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)} className="w-5 h-5 flex items-center justify-center font-bold text-gray-700 hover:text-orange-800">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PICKUP TIME */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Pickup Time</h2>

            <div className="flex flex-wrap gap-2">
              {timeSlots.map(time => (
                <button 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all ${
                    selectedTime === time 
                    ? "bg-orange-800 text-white shadow-lg shadow-orange-800/20 scale-105" 
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="mt-6 bg-[#ebe3d5] p-6 rounded-2xl">

            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Service Fee</span>
              <span>LKR {serviceFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-orange-800">
                LKR {total.toFixed(2)}
              </span>
            </div>

            <button className="w-full mt-4 bg-orange-800 text-white py-3 rounded-xl font-bold" onClick={() => {
              if (cart.length === 0) return alert("Your cart is empty!");
              
              const orderData = {
                orderId: 'ORD-' + Date.now(),
                items: cart.map(item => ({
                  id: item.id || item._id,
                  name: item.name,
                  price: item.price,
                  quantity: item.qty,
                  category: item.category || 'General'
                })),
                subtotal: subtotal,
                tax: serviceFee,
                total: total,
                pickupTime: selectedTime
              };

              navigate('/payment', { state: orderData });
            }}>
              Place Order
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}