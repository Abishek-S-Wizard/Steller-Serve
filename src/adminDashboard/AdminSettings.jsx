
import React, { useState } from "react";
import "./AdminDashboard.css";

export default function AdminSettings() {
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "admin@stellerserve.com",
    phone: "9876543210",
    password: "",
    confirmPassword: "",
  });

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (adminData.password && adminData.password !== adminData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("✅ Settings saved successfully!");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">⚙️ Admin Settings</h2>

      {/* Profile Settings */}
      <div className="dashboard-card-form">
        <h3>👤 Profile Settings</h3>
        <form onSubmit={handleSave} className="form-section">
          <input
            type="text"
            name="name"
            value={adminData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={adminData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            placeholder="New Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={adminData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          <button type="submit" className="btn-primary">💾 Save Changes</button>
        </form>
      </div>

      {/* System Settings */}
      <div className="dashboard-card-form">
        <h3>🖥️ System Settings</h3>
        <div className="settings-toggle">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
            {notificationsEnabled ? "🔕 Disable Notifications" : "🔔 Enable Notifications"}
          </button>
        </div>
      </div>
    </div>
  );
}
