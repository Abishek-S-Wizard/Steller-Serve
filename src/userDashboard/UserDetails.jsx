// src/userDashboard/UserDetails.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./UserDetails.css";

export default function UserDetails() {
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "user",        
    servicetype: "",     
    experience: "",
    address: "",
  });

  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch logged-in user profile from Supabase
  useEffect(() => {
    async function fetchProfile() {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) return;

      const { id } = authData.user;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, name, email, phone, address, role, servicetype, experience, address")
        .eq("id", id)
        .maybeSingle();

      if (!error && profile) {
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      }
    }

    fetchProfile();
  }, []);

  // Handle profile save (profile + email/password)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Update profile fields in "profiles" table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: user.name,
          phone: user.phone,
          address: user.address,
          servicetype: user.servicetype,
          experience: user.experience,
          address: user.address,
        })
        .eq("id", user.id);
      if (updateError) throw updateError;

      //  Update email/password in Auth if changed
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) throw new Error("Auth user not found");

      if (password || user.email !== authUser.user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: user.email,
          ...(password && { password }),
        });
        if (authError) throw authError;
      }

      alert("✅ Profile updated successfully!");
      setIsEditing(false);
      setPassword("");
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Update error:", error.message);
      alert("❌ Update failed: " + error.message);
    }
  };

  return (
    <div className="userdetails-container">
      <h2>👤 User Profile</h2>

      {!isEditing ? (
        <div className="userdetails-view">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          {user.role === "service" && (
            <>
              <p><strong>Service Type:</strong> {user.servicetype}</p>
              <p><strong>Experience:</strong> {user.experience}</p>
              <p><strong>Location:</strong> {user.address}</p>
            </>
          )}
          <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="userdetails-form">
          <label>Name:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />

          <label>Phone:</label>
          <input
            type="text"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            required
          />

          <label>Address:</label>
          <input
            type="text"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            required
          />

          {user.role === "service" && (
            <>
              <label>Service Type:</label>
              <input
                type="text"
                value={user.servicetype}
                onChange={(e) => setUser({ ...user, servicetype: e.target.value })}
              />
              <label>Experience:</label>
              <input
                type="text"
                value={user.experience}
                onChange={(e) => setUser({ ...user, experience: e.target.value })}
              />
              <label>Location:</label>
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />
            </>
          )}

          <label>Change Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="btn-row">
            <button type="submit" className="save-btn">💾 Save</button>
            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>❌ Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
