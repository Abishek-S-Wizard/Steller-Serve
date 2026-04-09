import React, { useState, useEffect } from "react";
import "./SupportHelp.css";
import { submitSupportTicket, fetchUserTickets } from "../services/AuthService";
import { supabase } from "../supabaseClient";

export default function SupportHelp() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch logged-in user from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to fetch user:", error.message);
        return;
      }

      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.user_metadata?.full_name || "",
        });
        loadTickets(currentUser.id);
      }
    };

    fetchUser();
  }, []);

  // Load tickets for the user
  const loadTickets = async (userId) => {
    try {
      const data = await fetchUserTickets(userId);
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err.message);
    }
  };

  const toggleFAQ = (index) => setActiveFAQ(activeFAQ === index ? null : index);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("❌ You must be logged in to submit a ticket.");
      return;
    }

    try {
      await submitSupportTicket(user.id, formData.name, formData.email, formData.message);
      setFormData({ name: "", email: "", message: "" });
      alert("✅ Your message has been sent! Admin will reply soon.");
      loadTickets(user.id);
    } catch (err) {
      alert("❌ Failed to submit ticket: " + err.message);
    }
  };

  const faqs = [
    {
      q: "How do I book a task?",
      a: "Go to Task Management in your dashboard, click 'Add Task', and fill in the required details.",
    },
    {
      q: "How do I track my service?",
      a: "You can track your service in real-time under Task Management → Track Progress.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support both Online (UPI, Cards) and Offline (Cash on Delivery) payments.",
    },
    {
      q: "How do I contact customer support?",
      a: "You can use the contact form below or reach us via email at support@stellerserve.com.",
    },
  ];

  return (
    <div className="support-container">
      <h2>💬 Support & Help</h2>
      <p className="subtitle">We’re here to assist you. Submit a ticket or view responses below.</p>

      {/* FAQ Section */}
      <div className="faq-section">
        <h3>❓ Frequently Asked Questions</h3>
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeFAQ === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">{item.q}</div>
            {activeFAQ === index && <div className="faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="contact-form">
        <h3>📩 Submit Ticket</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
      </div>

      {/* Ticket History */}
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
