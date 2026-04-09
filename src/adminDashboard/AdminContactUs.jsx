import React, { useEffect, useState } from "react";
import { fetchContactMessages } from "../services/AuthService";
//import "./AdminDashboard.css";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchContactMessages();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err.message);
      }
    };
    loadMessages();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📬 Contact Messages</h2>
      <table className="support-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Sent At</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? messages.map((msg, idx) => (
            <tr key={msg.id}>
              <td>{idx + 1}</td>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.phone}</td>
              <td>{msg.message}</td>
              <td>{new Date(msg.created_at).toLocaleString()}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No messages found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
