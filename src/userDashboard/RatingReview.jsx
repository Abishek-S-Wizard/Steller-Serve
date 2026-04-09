import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { fetchServiceWorkers, submitReview } from "../services/AuthService";
import ServiceReviews from "../serviceDashboard/ServiceReviews";
import "./RatingReview.css";

export default function RatingReview({ userId: propUserId }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState("");
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [userId, setUserId] = useState(propUserId || null);

  /* ================= GET LOGGED-IN USER ================= */
  useEffect(() => {
    if (propUserId) return;

    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) setUserId(user.id);
    }

    getUser();
  }, [propUserId]);

  /* ================= FETCH SERVICES ================= */
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetchServiceWorkers();
        setServices(data || []);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }

    loadServices();
  }, []);

  /* ================= SUBMIT REVIEW ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !selectedService || rating === 0 || review.trim() === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      await submitReview(userId, selectedService, rating, review);

      setRating(0);
      setReview("");
      setHover(null);
      setRefreshReviews((prev) => prev + 1); // 🔄 reload reviews
    } catch (err) {
      console.error("Review submit error:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="review-container">
      <h2>⭐ Submit a Review</h2>

      {/* ================= SERVICE SELECT ================= */}
      <div className="service-select">
        <label>Select Service:</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">-- Select --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name || s.full_name || "Service"}
            </option>
          ))}
        </select>
      </div>

      {/* ================= REVIEW FORM ================= */}
      {selectedService && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${
                  i + 1 <= (hover || rating) ? "active" : ""
                }`}
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(null)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />

          <button type="submit">Submit Review</button>
        </form>
      )}

      {/* ================= SERVICE REVIEWS ================= */}
      {selectedService && (
        <ServiceReviews
          serviceId={selectedService}
          refreshTrigger={refreshReviews}
        />
      )}
    </div>
  );
}
