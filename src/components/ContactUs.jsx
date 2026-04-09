import React, { useState } from 'react';
import '../styles/ContactUs.css';
import { submitContactMessage } from "../services/AuthService";

const ContactUS = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactMessage(formData.name, formData.email, formData.number, formData.message);
      setSubmitted(true);
      setFormData({ name: "", email: "", number: "", message: "" });
    } catch (err) {
      alert("Failed to send message: " + err.message);
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>Have a question or need help? Reach out to us!</p>

        {submitted && <p className="success-msg">✅ Message sent successfully!</p>}

        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          <input type="number" name="number" placeholder="Your Phone Number" value={formData.number} onChange={handleChange} required />
          <textarea name="message" rows="5" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactUS;
