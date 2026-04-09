
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; 
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({ name: "Admin" });
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);


  useEffect(() => {
    const fetchAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("name, email, role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching admin profile:", error);
        } else {
          setAdmin(data);
        }
      } else {
        // if no user is logged in → redirect to login
        navigate("/admin-login");
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin"); // cleanup old localStorage
    navigate("/admin-login");
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <h2 className="dashboard-title">👋 Welcome, Admin </h2>

      {/* Dashboard Options */}
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/overview")}>
          📊 Overview
        </div>
        <div className="dashboard-card" onClick={() => navigate("/admin-tasks")}>
          🧾 Task Management
        </div>
        <div className="dashboard-card" onClick={() => navigate("/users")}>
          👤 Manage Users
        </div>
        <div className="dashboard-card" onClick={() => navigate("/services")}>
          🛠 Manage Services
        </div>
        <div className="dashboard-card" onClick={() => navigate("/jobs")}>
          📋 Job Management
        </div>
        <div className="dashboard-card" onClick={() => navigate("/salary")}>
          💰 Salary Management
        </div>
        <div className="dashboard-card" onClick={() => navigate("/attendance")}>
          🙋‍♂️ Attendance
        </div>
        <div className="dashboard-card" onClick={() => navigate("/reports")}>
          📑 Reports & Analytics
        </div>
        <div className="dashboard-card" onClick={() => navigate("/admin-reviews")}>
          ⭐ All Reviews
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/notifications")}
        >
          🔔 More Projects
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin-support")}
        >
          🆘 User Support
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/service-supports")}
        >
          🆘 Service Support
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin-contact-messages")}
        >
          📬 Other Support
        </div>
        
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
