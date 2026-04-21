import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const navigate = useNavigate(); // ✅ FIXED (inside component)
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${apiBaseUrl}/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      const { token, user, message, messsage } = response.data || {};

      if (!token || !user) {
        setApiError(message || messsage || "Login failed");
        return;
      }

      localStorage.setItem("mm_token", token);
      localStorage.setItem("mm_user", JSON.stringify(user));
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      
      if (user.type === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center">

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhvP7pmoCTcsHdCBTVjGwK6iJ31y6FxLMYi0Slt2o0AmFZdLmuZydeZECgJgN5ngxwMP_3dEZPpCflPjxVUzy3CpbFi2O1Dk2n6CKP5vNlR_yDCLjwp_XUKAP7WO4AjYszMyzvAfwqG4d9bVvVvhLLfqpxFuF8iKg3tVOR_89psZztgCC9TiwZIABao5HsLADHSi1KKRTv6O8aC2rogcd8Lk5zHzAP5ZykPWbfEFCTo9D7Ulrvy39Y_3_tHRlGzrP28YqxU_FoLMc"
          alt="bg"
          className="w-full h-full object-cover blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* MAIN */}
      <div className="relative z-10 w-full max-w-5xl h-[92vh] flex rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-lg">

        {/* LEFT */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Kitchen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhvP7pmoCTcsHdCBTVjGwK6iJ31y6FxLMYi0Slt2o0AmFZdLmuZydeZECgJgN5ngxwMP_3dEZPpCflPjxVUzy3CpbFi2O1Dk2n6CKP5vNlR_yDCLjwp_XUKAP7WO4AjYszMyzvAfwqG4d9bVvVvhLLfqpxFuF8iKg3tVOR_89psZztgCC9TiwZIABao5HsLADHSi1KKRTv6O8aC2rogcd8Lk5zHzAP5ZykPWbfEFCTo9D7Ulrvy39Y_3_tHRlGzrP28YqxU_FoLMc"
          />

          <div className="relative z-10 p-6 flex flex-col justify-between h-full bg-gradient-to-t from-black/70 to-transparent">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Heirloom <br /> Ledger
              </h1>
              <p className="text-white/80 text-sm">
                Connecting the field to your tray.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col justify-center px-6 py-6 bg-white/10 backdrop-blur-xl">

          <div className="max-w-sm mx-auto w-full">

            <h2 className="text-2xl font-bold mb-2 text-white">
              Welcome Back
            </h2>

            <p className="text-white/70 text-sm mb-6">
              Enter your credentials
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {apiError && <p className="text-red-400 text-xs">{apiError}</p>}

            </form>

            <div className="my-4 text-center text-xs text-white/60">
              OR
            </div>

            {/* 🔥 FIXED SIGN UP BUTTON */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate("/register")} // ✅ GO TO REGISTER PAGE
                className="col-span-2 bg-white/20 text-white py-2 rounded-lg text-sm hover:bg-white/30 transition"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;