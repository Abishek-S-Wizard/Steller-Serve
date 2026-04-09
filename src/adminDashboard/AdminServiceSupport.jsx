import React, { useState, useEffect } from "react";
import "./AdminServiceSupport.css";
import { fetchAllServiceTickets, replyServiceTicket } from "../services/AuthService";

export default function ServiceSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await fetchAllServiceTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load service tickets:", err.message);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || replyMessage.trim() === "") return;

    try {
      await replyServiceTicket(selectedTicket.id, replyMessage);
      setReplyMessage("");
      setSelectedTicket(null);
      loadTickets();
    } catch (err) {
      alert("❌ Failed to send reply: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🧑‍🔧 Service Worker Support</h2>

      <table className="support-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Reply</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id}>
              <td>{index + 1}</td>
              <td>{ticket.profiles?.name || "N/A"}</td>
              <td>{ticket.profiles?.email || "N/A"}</td>
              <td>{ticket.message}</td>
              <td>{ticket.reply || "No reply yet"}</td>
              <td className={ticket.status === "Resolved" ? "status-resolved" : "status-open"}>
                {ticket.status}
              </td>
              <td>
                {ticket.status === "Open" ? (
                  <button className="btn-primary" onClick={() => setSelectedTicket(ticket)}>
                    Reply
                  </button>
                ) : (
                  "✅ Done"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTicket && (
        <div className="dashboard-card">
          <h3>Reply to: {selectedTicket.profiles?.name}</h3>
          <textarea
            className="input-box"
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button className="btn-primary" onClick={handleReply}>
            Send Reply
          </button>
        </div>
      )}
    </div>
  );
}
