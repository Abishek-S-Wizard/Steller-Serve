// src/components/ServiceLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./authserviceregister.css";

export default function ServiceLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // ✅ Step 1: Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      const user = data.user;

      // ✅ Step 2: Try to fetch profile
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email, role")
        .eq("id", user.id)
        .maybeSingle(); // 👉 safer than .single()

      // ✅ Step 3: If no profile, insert a new one
      if (!profile) {
        const pendingProfile = JSON.parse(
          localStorage.getItem("pendingServiceProfile")
        );

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              name: pendingProfile?.name || "New Service",
              email: user.email,
              role: "service",
              phone: pendingProfile?.phone || null,
              address: pendingProfile?.address || null,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      // ✅ Step 4: Check role
      if (profile.role !== "service") {
        throw new Error("This account is not a service provider.");
      }

      // ✅ Step 5: Store and navigate
      localStorage.setItem("service", JSON.stringify(profile));
      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/service-dashboard");
      }, 500);
    } catch (err) {
      console.error("Service login error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>StellerServe - Service Provider Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Service provider email"
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

        <button type="submit">Login</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div className="auth-link">
          <a href="/service-register">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
}
