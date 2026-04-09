
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 
import { registerUser, insertUserProfile } from "../services/AuthService";
import "./AdminDashboard.css";

export default function AdminServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    servicetype: "",
    experience: "",
    location: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch all users with role = 'service'
  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "service")
      .order("created_at", { ascending: false });

    if (error) console.error("❌ Fetch error:", error);
    else setServices(data);
    setLoading(false);
  };

  // Add new service worker
  const addService = async () => {
    const { name, email, phone, address, password, servicetype, experience, location } = formData;
    if (!name || !email || !password) {
      alert("⚠️ Fill Name, Email, and Password");
      return;
    }

    setLoading(true);
    try {
      
      const regRes = await registerUser(
        email,
        password,
        name,
        "service", 
        phone,
        address,
        servicetype,
        experience,
        location
      );

      
      await insertUserProfile(
        regRes.userId,
        name,
        email,
        "service",
        phone,
        address,
        servicetype,
        experience,
        location
      );

      alert("✅ Service worker added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        servicetype: "",
        experience: "",
        location: "",
      });
      fetchServices();
    } catch (err) {
      alert("❌ " + err.message);
    }
    setLoading(false);
  };

  
  const startEditing = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name || "",
      email: service.email || "",
      phone: service.phone || "",
      address: service.address || "",
      password: "",
      servicetype: service.servicetype || "",
      experience: service.experience || "",
      location: service.location || "",
    });
  };

  
  const saveEdit = async () => {
    if (!editingServiceId) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        servicetype: formData.servicetype,
        experience: formData.experience,
        location: formData.location,
      })
      .eq("id", editingServiceId);

    if (error) alert("❌ " + error.message);
    else {
      alert("✅ Changes saved!");
      cancelEdit();
      fetchServices();
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditingServiceId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      servicetype: "",
      experience: "",
      location: "",
    });
  };

  // Delete service worker
  const removeService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service worker?")) return;

    setLoading(true);
    try {
      
      await supabase.auth.admin.deleteUser(serviceId);

      
      const { error } = await supabase.from("profiles").delete().eq("id", serviceId);
      if (error) throw error;

      alert("🗑️ Service worker deleted successfully!");
      fetchServices();
    } catch (err) {
      alert("❌ " + err.message);
    }
    setLoading(false);
  };

  
  const setPassword = async (serviceId) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;

    setLoading(true);
    try {
      await supabase.auth.admin.updateUserById(serviceId, { password: newPassword });
      alert("🔑 Password updated successfully!");
    } catch (err) {
      alert("❌ " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <h2>🛠️ Service Worker Management</h2>

      <div className="action-box form-grid">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} disabled={!!editingServiceId} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="servicetype" placeholder="Service Type" value={formData.servicetype} onChange={handleChange} />
        <input type="text" name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        {!editingServiceId && (
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        )}

        {editingServiceId ? (
          <>
            <button onClick={saveEdit} disabled={loading}>💾 Save</button>
            <button onClick={cancelEdit} disabled={loading}>❌ Cancel</button>
          </>
        ) : (
          <button onClick={addService} disabled={loading}>{loading ? "Adding..." : "➕ Add Service Worker"}</button>
        )}
      </div>

      <div className="list-box">
        {loading ? (
          <p>Loading...</p>
        ) : services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="list-item">
              {editingServiceId === service.id ? null : (
                <>
                  <span>{service.name || "(No Name)"} <small>({service.email})</small></span>
                  <button onClick={() => startEditing(service)} disabled={loading}>✏️ Edit</button>
                  <button className="remove-btn" onClick={() => removeService(service.id)} disabled={loading}>🗑️ Remove</button>
                  <button onClick={() => setPassword(service.id)} disabled={loading}>🔑 Set Password</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>.</p>
        )}
      </div>
    </div>
  );
}
