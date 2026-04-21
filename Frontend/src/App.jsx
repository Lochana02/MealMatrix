import React, { useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";


// import Home from "../pages/Home";
import LandingPage from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
//admin
import CategoryManagement from "../pages/admin/CategoryManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import AdminMenu from "../pages/admin/adminMenu";
import AdminPayment from "../pages/Payment/AdminPayment";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminFeedback from "../pages/FeedbackAdmin/AdminFeedback";
import KitchenRoom from "../pages/admin/KitchenRoom";
import TimeSlot from "../pages/admin/TimeSlot/TimeSlot";
import Notification from "../components/Notification/Notification";
//user
// import Product from "../pages/user/Product";
import CartPage from "../pages/user/Cart";
import Menu from "../pages/user/Menu";

import PaymentPage from "../pages/Payment/PaymentPage";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import CustomerFeedback from "../pages/Feedback/CustomerFeedback";

function getAuthToken() {
  return localStorage.getItem("mm_token");
}

function ProtectedRoute({ children }) {
  const token = getAuthToken();
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const token = getAuthToken();
  const user = JSON.parse(localStorage.getItem("mm_user") || "{}");
  
  if (!token) return <Navigate to="/login" replace />;
  if (user.type !== "admin") return <Navigate to="/" replace />;
  
  return children;
}

function PublicOnlyRoute({ children }) {
  return getAuthToken() ? <Navigate to="/" replace /> : children;
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const token = getAuthToken();

    if (token) { axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else { delete axios.defaults.headers.common.Authorization;}
  }, []);

  useEffect(() => {
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
  }, [location.pathname]);

  return (
    <Routes>
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path="/login" element={(<PublicOnlyRoute><Login /></PublicOnlyRoute>)}/>
      <Route path="/register" element={(<PublicOnlyRoute><Register /></PublicOnlyRoute>)}/>

      <Route path="/category" element={(<AdminRoute><CategoryManagement /></AdminRoute>)}/>
      {/* <Route path="/Products" element={(<ProtectedRoute><Product /></ProtectedRoute>)}/> */}
      <Route path="/cart" element={(<ProtectedRoute><CartPage /></ProtectedRoute>)}/>
      <Route path="/Order" element={(<AdminRoute><OrderManagement /></AdminRoute>)} />

      <Route path="/" element={<LandingPage />} />
      <Route path="/Menu" element={<Menu />} />
      <Route path="/feedback" element={<CustomerFeedback />} />

      <Route path="/payment" element={(<ProtectedRoute><PaymentPage /></ProtectedRoute>)} />
      <Route path="/payment-success" element={(<ProtectedRoute><PaymentSuccess /></ProtectedRoute>)} />

      <Route path="/adminMenu" element={(<AdminRoute><AdminMenu /></AdminRoute>)} />
      <Route path="/admin-payment" element={(<AdminRoute><AdminPayment /></AdminRoute>)} />
      <Route path="/admin-dashboard" element={(<AdminRoute><AdminDashboard /></AdminRoute>)} />
      <Route path="/admin-feedback" element={(<AdminRoute><AdminFeedback /></AdminRoute>)} />
      <Route path="/kitchen-room" element={(<AdminRoute><KitchenRoom /></AdminRoute>)} />
      <Route path="/admin-time-slots" element={(<AdminRoute><TimeSlot /></AdminRoute>)} />
      <Route path="/notification" element={(<AdminRoute><Notification /></AdminRoute>)} />


    </Routes>
  );
}

export default App;