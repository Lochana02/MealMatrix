import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // ✅ STATE
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ HANDLE SUBMIT (CONNECT TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${apiBaseUrl}/users/register`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }
      );

      alert(res.data.message);
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAytqlKGSkFF5SQrnXJ64USTc_h53lvtxlekcPjDOg-pMdaGef1W8TdhB9xkoFQkeX1VWcmV9sPPv6rqEOo7lflJPxE99b4SVt5h5QtusU7yw1MPeZ-AoOyrPPY980pvE1ExKNlGvRkFALMjSuF58n-_c4M-OcSax6zYYc0Q9yynSOK8XMRWdWoua4K1IyX9paWifmNKK0dKZeXrJtYoYuMWS2cre0RIE6Jv-dwG3pjfIuSBrUaRH851qzhcMRs6xPSEKIrPeCTTc')",
        }}
      />

      {/* BLUR */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/40"></div>

      {/* MAIN */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-[90%] max-w-5xl h-[90vh] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex">

          {/* LEFT */}
          <div className="hidden md:block w-1/2 relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAytqlKGSkFF5SQrnXJ64USTc_h53lvtxlekcPjDOg-pMdaGef1W8TdhB9xkoFQkeX1VWcmV9sPPv6rqEOo7lflJPxE99b4SVt5h5QtusU7yw1MPeZ-AoOyrPPY980pvE1ExKNlGvRkFALMjSuF58n-_c4M-OcSax6zYYc0Q9yynSOK8XMRWdWoua4K1IyX9paWifmNKK0dKZeXrJtYoYuMWS2cre0RIE6Jv-dwG3pjfIuSBrUaRH851qzhcMRs6xPSEKIrPeCTTc"
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute bottom-10 left-10 text-white space-y-2">
              <h1 className="text-3xl font-bold">Heirloom Ledger</h1>
              <p className="text-sm opacity-80">
                Connecting the field to your tray.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-12">
            <div className="w-full max-w-sm space-y-5 text-white">

              <div>
                <h2 className="text-2xl font-bold">Create Account</h2>
                <p className="text-sm text-white/70">
                  Enter your details
                </p>
              </div>

              {/* ✅ FORM */}
              <form className="space-y-4" onSubmit={handleSubmit}>

                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none"
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    onChange={handleChange}
                    required
                    className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Create Account
                </button>

              </form>

              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[1px] bg-white/20"></div>
                <span className="text-xs text-white/60">OR</span>
                <div className="flex-1 h-[1px] bg-white/20"></div>
              </div>

              {/* Navigate to login */}
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-white/20 py-3 rounded-lg hover:bg-white/30 transition"
              >
                Sign In Instead
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}