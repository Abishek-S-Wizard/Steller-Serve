import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { fetchAllSupportTickets, replyToTicket } from "../services/AuthService";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await fetchAllSupportTickets();
    setTickets(data);
  };

  const handleReply = async () => {
    if (!selectedTicket || replyMessage.trim() === "") return;
    await replyToTicket(selectedTicket.id, replyMessage);
    setReplyMessage("");
    setSelectedTicket(null);
    loadTickets();
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🛠️ Support & Help Desk</h2>

      <table className="salary-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Reply</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id}>
              <td>{index + 1}</td>
              <td>{ticket.user_name}</td>
              <td>{ticket.user_email}</td>
              <td>{ticket.message}</td>
              <td className={ticket.status === "Resolved" ? "status-paid" : "status-pending"}>{ticket.status}</td>
              <td>{ticket.reply || "No reply yet"}</td>
              <td>
                {ticket.status === "Open" ? (
                  <button className="btn-primary" onClick={() => setSelectedTicket(ticket)}>Reply</button>
                ) : "✅ Done"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTicket && (
        <div className="dashboard-card">
          <h3>Reply to: {selectedTicket.user_name}</h3>
          <textarea className="input-box" placeholder="Type your reply..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
          <button className="btn-primary" onClick={handleReply}>Send Reply</button>
        </div>
      )}
    </div>
  );
}
