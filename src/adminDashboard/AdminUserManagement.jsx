
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Make sure this uses service-role key
import { registerUser, insertUserProfile } from "../services/AuthService";
import "./AdminDashboard.css";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "user")
      .order("created_at", { ascending: false });

    if (error) console.error("❌ Fetch error:", error);
    else setUsers(data);
    setLoading(false);
  };

  
  const addUser = async () => {
    const { name, email, phone, address, password } = formData;
    if (!name || !email || !password) {
      alert("⚠️ Fill Name, Email, and Password");
      return;
    }

    setLoading(true);
    try {
      
      const regRes = await registerUser(email, password, name, "user", phone, address);

      
      await insertUserProfile(regRes.userId, name, email, "user", phone, address);

      alert("✅ User added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });
      fetchUsers();
    } catch (err) {
      alert("❌ " + err.message);
    }
    setLoading(false);
  };

 
  const startEditing = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      password: "",
    });
  };


  const saveEdit = async () => {
    if (!editingUserId) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })
      .eq("id", editingUserId);

    if (error) alert("❌ " + error.message);
    else {
      alert("✅ Changes saved!");
      cancelEdit();
      fetchUsers();
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    });
  };

  
  const removeUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      
      await supabase.auth.admin.deleteUser(userId);

      
      const { error } = await supabase.from("profiles").delete().eq("id", userId);
      if (error) throw error;

      alert("🗑️ User deleted successfully!");
      fetchUsers();
    } catch (err) {
      alert("❌ " + err.message);
    }
    setLoading(false);
  };

  
  const setPassword = async (userId) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    setLoading(true);
    try {
      await supabase.auth.admin.updateUserById(userId, { password: newPassword });
      alert("🔑 Password updated successfully!");
    } catch (err) {
      alert("❌ " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h2>👤 User Management</h2>

      <div className="action-box form-grid">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} disabled={!!editingUserId} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        {!editingUserId && (
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        )}

        {editingUserId ? (
          <>
            <button onClick={saveEdit} disabled={loading}>💾 Save</button>
            <button onClick={cancelEdit} disabled={loading}>❌ Cancel</button>
          </>
        ) : (
          <button onClick={addUser} disabled={loading}>{loading ? "Adding..." : "➕ Add User"}</button>
        )}
      </div>

      <div className="list-box">
        {loading ? (
          <p>Loading...</p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="list-item">
              {editingUserId === user.id ? null : (
                <>
                  <span>{user.name || "(No Name)"} <small>({user.email})</small></span>
                  <button onClick={() => startEditing(user)} disabled={loading}>✏️ Edit</button>
                  <button className="remove-btn" onClick={() => removeUser(user.id)} disabled={loading}>🗑️ Remove</button>
                  <button onClick={() => setPassword(user.id)} disabled={loading}>🔑 Set Password</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
}
