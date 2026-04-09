
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./ServiceDashboard.css";

export default function ServiceDashboard() {
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  
  useEffect(() => {
    const fetchAndSaveProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/service-login");
          return;
        }

        
        const pendingProfile = JSON.parse(localStorage.getItem("pendingServiceProfile"));
        if (pendingProfile) {
          const { error: insertError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: user.id,
                name: pendingProfile.name,
                email: pendingProfile.email,
                role: "service",
                phone: pendingProfile.phone,
                address: pendingProfile.address,
                servicetype: pendingProfile.servicetype,
                experience: pendingProfile.experience,
              },
              { onConflict: "id" }
            );

          if (insertError) {
            console.error("Profile insert error:", insertError.message);
          } else {
            localStorage.removeItem("pendingServiceProfile");
          }
        }

        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, name, email, role, servicetype, experience")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile || profile.role !== "service") {
          navigate("/service-login");
          return;
        }

        setService(profile);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        navigate("/service-login");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSaveProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("service"); // cleanup fallback
    navigate("/service-login");
  };

  if (loading) {
    return <div className="dashboard-container">⏳ Loading dashboard...</div>;
  }

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <h2 className="dashboard-title">🛠️ Welcome, {service?.name || "Service Worker"}</h2>

      {/* Dashboard Options */}
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/service-tasks")}>
          📋 Task Management
        </div>

        <div className="dashboard-card" onClick={() => navigate("/service-attendance")}>
          🕒 Attendance
        </div>

        <div className="dashboard-card" onClick={() => navigate("/service-salary")}>
          💰 Salary & Earnings
        </div>

        <div className="dashboard-card" onClick={() => navigate("/service-reviews")}>
          ⭐ View Reviews
        </div>

        <div className="dashboard-card" onClick={() => navigate("/service-support")}>
          🆘 Contact Admin
        </div>

        <div className="dashboard-card" onClick={() => navigate("/service-profile")}>
          👤 Profile Management
        </div>

        <div className="dashboard-card" onClick={() => navigate("/notifications")}>
          🔔 Services
        </div>

        <div className="dashboard-card" onClick={() => navigate("/service-reports")}>
          📊 Reports & Analytics
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
