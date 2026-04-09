// src/components/ServiceRegister.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./authserviceregister.css";

export default function ServiceRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    servicetype: "",
    experience: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    if (!formData.servicetype.trim()) {
      setMessage("❌ Service Type is required for service providers!");
      return;
    }

    if (!formData.experience || parseInt(formData.experience) < 0) {
      setMessage("❌ Experience is required and must be 0 or more!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Step 1: Create account in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // ✅ Store profile locally until login
      localStorage.setItem(
        "pendingServiceProfile",
        JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          role: "service",
          phone: formData.phone,
          address: formData.location,
          servicetype: formData.servicetype,
          experience: formData.experience,
        })
      );

      setMessage(
        "✅ Account created! Please check your email and confirm before logging in."
      );

      // Redirect to service login
      navigate("/service-login");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        servicetype: "",
        experience: "",
        location: "",
      });
    } catch (err) {
      console.error("Service registration error:", err.message);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>StellerServe - Service Provider Registration</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Enter your full name"
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Enter password"
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Re-enter password"
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          placeholder="Enter your phone number"
          onChange={handleChange}
          required
        />

        <label>Service Type</label>
        <input
          type="text"
          name="servicetype"
          value={formData.servicetype}
          placeholder="e.g., Plumbing, Cleaning, Babysitting"
          onChange={handleChange}
          required
        />

        <label>Experience (in years)</label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          placeholder="Enter years of experience"
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          placeholder="Enter your working location"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
