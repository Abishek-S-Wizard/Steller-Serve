// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { loginUser } from "../services/AuthService"; // ✅ import Supabase login

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Use Supabase Auth
      const { user, profile } = await loginUser(formData.email, formData.password);

      if (!profile || profile.role !== "admin") {
        setError("🚫 Access denied! You are not an admin.");
        return;
      }

      // ✅ Save to localStorage
      localStorage.setItem("admin", JSON.stringify(profile));

      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.message || "⚠️ Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">StellerServe - Admin Login</h2>
      <div className="auth-box">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
