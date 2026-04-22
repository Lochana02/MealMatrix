import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const apiUploadsUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads";

const MenuCard = ({ item, onAdd }) => {
  return (
    <div className="group bg-stone-50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:bg-stone-100 hover:-translate-y-1">
      <div className="aspect-[4/5] overflow-hidden bg-stone-200 relative flex items-center justify-center">
        <span className="material-symbols-outlined text-stone-400 text-6xl opacity-50">
          fastfood
        </span>
        {item.image && (
          <img
            src={`${apiUploadsUrl}/${item.image}`}
            alt={item.name}
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow z-10 bg-stone-50 relative">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl leading-tight text-stone-900">
            {item.name}
          </h3>
          <span className="font-bold text-orange-700 whitespace-nowrap">
            LKR {item.price || 0}
          </span>
        </div>

        <p className="text-sm text-stone-500 leading-relaxed mb-6 line-clamp-3">
          {item.description || "No description provided."}
        </p>

        <button onClick={() => onAdd(item)} className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-orange-700 to-orange-900 text-white font-bold active:scale-95 transition-all duration-200 hover:opacity-95">
          Add to Tray
        </button>
      </div>
    </div>
  );
};

const Menu = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, catRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/menu`),
          axios.get(`${apiBaseUrl}/categories`)
        ]);
        setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        console.error("Error fetching menu data:", err);
      } finally {
        setLoading(false);
      }

      try {
        const token = localStorage.getItem("mm_token");
        if (token) {
          const cartRes = await axios.get(`${apiBaseUrl}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (cartRes.data && cartRes.data.success) {
            setCart(cartRes.data.cart);
          }
        }
      } catch (err) {
        console.warn("Could not fetch cart data:", err);
      }
    };
    fetchData();
  }, [apiBaseUrl]);

  const handleAddToCart = async (item) => {
    const existingItem = cart.find((c) => c.id === item._id);
    let newCart;
    if (existingItem) {
      newCart = cart.map((c) => c.id === item._id ? { ...c, qty: c.qty + 1 } : c);
    } else {
      newCart = [...cart, {
        id: item._id,
        name: item.name,
        price: item.price,
        qty: 1,
        img: item.image ? `${apiUploadsUrl}/${item.image}` : '',
        description: item.description
      }];
    }
    setCart(newCart);
    try {
      const token = localStorage.getItem("mm_token");
      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }
      await axios.put(`${apiBaseUrl}/cart`, { items: newCart }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Error syncing cart", err);
    }
  };

  // Merge items missing category into an "Other" category
  const allCategories = [...categories];
  const uncategorizedItems = items.filter(
    (item) => !item.category || !categories.find((c) => c.name === item.category)
  );
  if (uncategorizedItems.length > 0 && !allCategories.find((c) => c.name === "Other")) {
    allCategories.push({ _id: "other", name: "Other" });
  }

  const groupedItems = allCategories.reduce((acc, category) => {
    acc[category.name] = items.filter((item) => {
      if (category.name === "Other") {
        return !item.category || !categories.find((c) => c.name === item.category);
      }
      return item.category === category.name;
    });
    return acc;
  }, {});

  const displayCategories =
    activeCategory === "All"
      ? allCategories
      : allCategories.filter((c) => c.name === activeCategory);

  return (
    <div className="min-h-screen bg-[#fef9ed] text-stone-900 flex flex-col">
      <Header />

      <main className="pt-24 flex-grow">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight font-['Plus_Jakarta_Sans'] mb-6">
              The Culinary <span className="text-orange-700 italic">Archive</span>
            </h1>

            <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-medium">
              A curated collection of artisanal nourishment, sustainably sourced
              and prepared with precision for the modern intellectual's canteen.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <div className="sticky top-[72px] z-40 bg-[#fef9ed]/90 backdrop-blur-md border-y border-stone-200/60">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 active:scale-95 ${
                activeCategory === "All"
                  ? "bg-green-100 text-green-800"
                  : "bg-stone-200 text-stone-700 hover:bg-stone-300"
              }`}
            >
              All
            </button>
            {allCategories.map((category) => {
              return (
                <button
                  key={category._id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 active:scale-95 ${
                    activeCategory === category.name
                      ? "bg-green-100 text-green-800"
                      : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24">
          {loading ? (
            <div className="text-center py-20 text-2xl font-bold text-stone-400 animate-pulse">
              Loading archive...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-2xl font-bold text-stone-400">
              No items available in the menu.
            </div>
          ) : (
            displayCategories.map((category) => {
              const categoryItems = groupedItems[category.name] || [];
              if (categoryItems.length === 0 && activeCategory === "All") return null;

              return (
                <div key={category._id} className="space-y-10">
                  {categoryItems.length === 0 ? (
                    <div className="text-center py-20 text-xl font-bold text-stone-400">
                      No items available in {category.name}.
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-4 border-b border-stone-300/60 pb-4">
                        <h2 className="text-3xl font-black font-['Plus_Jakarta_Sans']">
                          {category.name}
                        </h2>
                        <span className="text-stone-500 font-semibold tracking-[0.2em] uppercase text-xs">
                          Archive Selection
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {categoryItems.map((item) => (
                          <MenuCard key={item._id} item={item} onAdd={handleAddToCart} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>

      <Footer />

      {/* Floating tray */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => navigate('/cart')} className="bg-gradient-to-r from-orange-700 to-orange-900 text-white pl-6 pr-8 py-4 rounded-full shadow-2xl flex items-center gap-4 transition-all duration-300 hover:scale-105 active:scale-95">
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-green-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-900">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight">
            View My Tray (LKR {cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)})
          </span>
        </button>
      </div>
    </div>
  );
};

export default Menu;