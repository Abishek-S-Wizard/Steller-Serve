// src/components/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import TaskManagement from "./TaskManagement"; // <-- make sure to import it
import "./UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/user-login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, name, email, role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile || profile.role !== "user") {
          navigate("/user-login");
          return;
        }

        setUserProfile(profile);
      } catch (err) {
        console.error("Error fetching user profile:", err.message);
        navigate("/user-login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("profile"); // fallback cleanup
    navigate("/user-login");
  };

  if (loading) {
    return <div className="dashboard-container">⏳ Loading user dashboard...</div>;
  }

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <h2 className="dashboard-title">
        👋 Welcome, {userProfile?.name || userProfile?.email?.split("@")[0] || "User"}
      </h2>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/profile")}>
          👤 Profile Management
        </div>

        <div className="dashboard-card" onClick={() => navigate("/tasks")}>
          📋 Task Management
        </div>

        <div className="dashboard-card" onClick={() => navigate("/notifications")}>
          🤝 Popular Services
        </div>

        <div className="dashboard-card" onClick={() => navigate("/ratings")}>
          ⭐ Ratings & Reviews
        </div>

        <div className="dashboard-card" onClick={() => navigate("/support")}>
          🆘 Support & Help
        </div>

      </div>

      {/* Directly render TaskManagement here so user_id is passed */}
      {/*{userProfile && <TaskManagement userId={userProfile.id} />}*/}

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
