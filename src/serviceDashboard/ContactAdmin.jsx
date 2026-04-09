import React, { useState, useEffect } from "react";
import "./ServiceDashboard.css";
import { supabase } from "../supabaseClient";
import { submitServiceTicket, fetchServiceTickets } from "../services/AuthService";

export default function ContactAdmin() {
  const [formData, setFormData] = useState({ message: "" });
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error) return console.error(error);
      if (currentUser) {
        setUser(currentUser);
        loadTickets(currentUser.id);
      }
    };
    fetchUser();
  }, []);

  const loadTickets = async (serviceId) => {
    const data = await fetchServiceTickets(serviceId);
    setTickets(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("❌ You must be logged in to submit a ticket.");

    await submitServiceTicket(user.id, formData.message);
    setFormData({ message: "" });
    loadTickets(user.id);
    alert("✅ Your message has been sent to Admin!");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📨 Contact Admin</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>Message:</label>
        <textarea
          name="message"
          rows="5"
          value={formData.message}
          onChange={(e) => setFormData({ message: e.target.value })}
          required
        ></textarea>

        <button type="submit" className="submit-btn">Send Message</button>
      </form>

      <div className="ticket-history">
        <h3>📂 Your Tickets</h3>
        {tickets.length === 0 ? (
          <p>No tickets submitted yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Message</th>
                <th>Reply</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.message}</td>
                  <td>{t.reply || "Waiting for reply"}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
