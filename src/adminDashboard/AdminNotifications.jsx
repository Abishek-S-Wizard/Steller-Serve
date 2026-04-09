import React, { useState } from "react";
import "./AdminDashboard.css";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "System Maintenance", message: "Scheduled downtime on Aug 30." },
    { id: 2, title: "New Policy Update", message: "Updated salary structure released." },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new notification
  const handleAdd = () => {
    if (!formData.title || !formData.message) return;
    const newNotification = {
      id: notifications.length + 1,
      title: formData.title,
      message: formData.message,
    };
    setNotifications([...notifications, newNotification]);
    setFormData({ title: "", message: "" });
  };

  // Remove notification
  const handleRemove = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🔔 Notifications Management</h2>

      {/* Add Notification Form */}
      <div className="dashboard-card-form">
        <h3>Add Notification</h3>
        <div className="form-section">
          <input
            type="text"
            name="title"
            placeholder="Enter Title"
            value={formData.title}
            onChange={handleChange}
          />
          <input
            type="text"
            name="message"
            placeholder="Enter Message"
            value={formData.message}
            onChange={handleChange}
          />
          <button className="btn-primary" onClick={handleAdd}>
            Add Notification
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="dashboard-card-form">
        <h3>📢 All Notifications</h3>
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li key={n.id} className="notification-item">
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                </div>
                <button className="btn-danger" onClick={() => handleRemove(n.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
