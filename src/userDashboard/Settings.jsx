import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

export default function Settings() {
  const navigate = useNavigate();

  // Persist dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
  }, [darkMode]);

  const handleThemeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleLogout = () => {
    alert("You have been logged out!");
    // Navigate to login page
    navigate("/login");
  };

  const handleResetPreferences = () => {
    localStorage.removeItem("darkMode");
    setDarkMode(false);
    document.body.classList.remove("dark-theme");
    alert("Preferences reset to default!");
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>
      <p className="subtitle">Customize your preferences</p>

      {/* Theme Settings */}
      <div className="settings-card">
        <h3>🌓 Theme</h3>
        <div className="setting-item">
          <span>Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleThemeToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Account Settings */}
      <div className="settings-card">
        <h3>🔑 Account Settings</h3>
        <div className="setting-item">
          <button className="btn" onClick={() => navigate("/profile")}>
            Update Profile
          </button>
        </div>
      </div>



      {/* Logout */}
      <div className="settings-card logout-card">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
