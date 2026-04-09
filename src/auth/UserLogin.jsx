// src/auth/UserLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import "./auth.css";

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, profile } = await loginUser(formData.email, formData.password);

      setError("");

      // Save user + profile in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("profile", JSON.stringify(profile));

      // ✅ Redirect based on role
      if (profile.role === "user") {
        navigate("/user-dashboard");
      } else if (profile.role === "service") {
        navigate("/service-dashboard");
      } else if (profile.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        setError("Invalid role assigned. Contact admin.");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">StellerServe - User Login</h2>
      <div className="auth-box">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>
        <div className="auth-link">
          <a href="/user-register">Don't have an account? Register</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
