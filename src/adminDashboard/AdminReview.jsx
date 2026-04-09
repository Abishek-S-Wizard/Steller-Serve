
import React, { useState, useEffect } from "react";
import { fetchAllReviews, deleteReviewById } from "../services/AuthService";
import "./AdminDashboard.css";

export default function AdminReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchAllReviews();
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReviewById(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete review failed:", err);
      alert("Failed to delete review");
    }
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="admin-dashboard">
      <h2>⭐ All Reviews</h2>

      {reviews.length === 0 && <p>No reviews found</p>}
    <center>
      {reviews.map((r) => (
        <div key={r.id} className="review-card">
          <p>
            <strong>User:</strong>{" "}
            {r.user?.name || r.user?.email || "Unknown User"} <br />
            <strong>Service:</strong>{" "}
            {r.service?.name || r.service?.email || "Unknown Service"}
          </p>

          <div className="review-stars">
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </div>

          <p>{r.review_text || "No comment provided"}</p>

          

          <br />

          <button onClick={() => handleDelete(r.id)}>🗑 Delete</button>
        </div>
      ))}
      </center>
    </div>
  );
}
