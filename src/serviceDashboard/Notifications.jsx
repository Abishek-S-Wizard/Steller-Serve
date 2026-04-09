import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { fetchNotifications, markNotificationRead } from "../services/TaskService";
import "./ServiceDashboard.css";

export default function Notifications() {
  const [serviceId, setServiceId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------- Fetch logged-in service ID --------
  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          window.location.href = "/service-login";
          return;
        }
        setServiceId(user.id);
      } catch (err) {
        console.error("Error fetching service:", err.message);
        window.location.href = "/service-login";
      }
    };
    fetchService();
  }, []);

  // -------- Fetch notifications for this service --------
  const loadNotifications = async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const data = await fetchNotifications(serviceId);
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();

    if (!serviceId) return;

    // -------- Real-time subscription --------
    const subscription = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiver_id=eq.${serviceId}`,
        },
        (payload) => {
          // Add new notification to top of list
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [serviceId]);

  // -------- Mark notification as read --------
  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read_status: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err.message);
    }
  };

  return (
    <div className="notifications-container">
      <h2>🔔 Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${
                n.read_status ? "read" : "unread"
              }`}
            >
              <p>{n.message}</p>
              <span className="notification-time">
                {new Date(n.created_at).toLocaleString()}
              </span>
              {!n.read_status && (
                <button onClick={() => handleMarkRead(n.id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
