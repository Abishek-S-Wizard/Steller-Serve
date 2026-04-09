import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { fetchUserTasks, createTask, updateTaskStatus, fetchTaskLogs } from "../services/TaskService";
import "./TaskManagement.css";

export default function TaskManagement() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    deadline: "",
    price: "",
    paymentMethod: "Cash on Delivery",
    onlinePaymentOption: "UPI",
    urgency: "Normal",
    image: null,
  });

  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [historyTask, setHistoryTask] = useState(null);
  const [taskLogs, setTaskLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Fetch logged-in user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          navigate("/user-login");
          return;
        }
        setUserId(user.id);
      } catch (err) {
        console.error("Error fetching user:", err.message);
        navigate("/user-login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Load user tasks
  const loadTasks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchUserTasks(userId);
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [userId]);

  // Form handling
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm({ ...form, image: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !userId) return;

    try {
      await createTask({
        user_id: userId,
        title: form.title,
        description: form.description,
        location: form.location,
        deadline: form.deadline,
        price: form.price,
        payment_method: form.paymentMethod,
        online_payment_option: form.onlinePaymentOption,
        urgency: form.urgency,
        imageFile: form.image, 
      });

      setForm({
        title: "",
        description: "",
        location: "",
        deadline: "",
        price: "0",
        paymentMethod: "Cash on Delivery",
        onlinePaymentOption: "UPI",
        urgency: "Normal",
        image: null,
      });

      await loadTasks();
    } catch (err) {
      console.error("Failed to create task:", err.message);
    }
  };

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    if (!userId) return;
    try {
      await updateTaskStatus(taskId, userId, newStatus, "Updated by user");
      await loadTasks();
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  const handleCancel = (taskId) => {
    if (window.confirm("Cancel this task?")) handleStatusChange(taskId, "Cancelled");
  };

  // Review submit
  const handleReviewSubmit = (taskId) => {
    alert(`⭐ Rated ${review.rating}/5 for task ${taskId}\n💬 "${review.comment}"`);
    setReview({ rating: 0, comment: "" });
    setSelectedTask(null);
  };

  // Fetch task logs
  const viewTaskHistory = async (task) => {
    setHistoryTask(task);
    setLoadingLogs(true);
    try {
      const logs = await fetchTaskLogs(task.id);
      setTaskLogs(logs);
    } catch (err) {
      console.error("Failed to fetch task logs:", err.message);
    }
    setLoadingLogs(false);
  };

  // Filter tasks safely
  const filteredTasks = filter === "All" ? tasks : tasks.filter((t) => (t.status || "Pending") === filter);

  return (
    <div className="task-container">
      <h2>🧾 Task Management (User Panel)</h2>
      <p className="subtitle">Create, manage, track, review, and view history of your service requests</p>

      {loading && <p>Loading tasks...</p>}

      {/* Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <select
  name="title"
  value={form.title}
  onChange={handleChange}
  required
>
  <option value="">Select Task Title</option>
  <option value="Video Editing">Video Editing</option>
  <option value="Advertisement Making">Advertisement Making</option>
  <option value="Event Creation">Event Creation</option>
  <option value="Project Works">Project Works</option>
  <option value="House Cleaning">House Cleaning</option>
  <option value="Deep Cleaning">Deep Cleaning</option>
  <option value="Window Cleaning">Window Cleaning</option>
  <option value="Laundry & Ironing">Laundry & Ironing</option>
  <option value="Car Cleaning / Detailing">Car Cleaning / Detailing</option>
  <option value="Carpet / Sofa Cleaning">Carpet / Sofa Cleaning</option>
  <option value="Pest Control">Pest Control</option>
  <option value="Water Tank Cleaning">Water Tank Cleaning</option>
  <option value="Plumbing">Plumbing</option>
  <option value="Electrical Work">Electrical Work</option>
  <option value="Painting">Painting</option>
  <option value="Carpentry / Furniture Repair">Carpentry / Furniture Repair</option>
  <option value="AC / Appliance Repair">AC / Appliance Repair</option>
  <option value="Home Decor Installation">Home Decor Installation</option>
  <option value="Minor Renovation / Fixing">Minor Renovation / Fixing</option>
  <option value="Door / Window Lock Repair">Door / Window Lock Repair</option>
  <option value="Furniture Assembly">Furniture Assembly</option>
  <option value="Baby Sitting / Daycare">Baby Sitting / Daycare</option>
  <option value="Elderly Care / Attendant">Elderly Care / Attendant</option>
  <option value="Pet Sitting / Dog Walking">Pet Sitting / Dog Walking</option>
  <option value="Personal Shopping / Assistance">Personal Shopping / Assistance</option>
  <option value="Beauty & Grooming at Home">Beauty & Grooming at Home</option>
  <option value="Fitness / Yoga Trainer at Home">Fitness / Yoga Trainer at Home</option>
  <option value="Grocery Shopping / Delivery">Grocery Shopping / Delivery</option>
  <option value="Courier / Parcel Delivery">Courier / Parcel Delivery</option>
  <option value="Document Submission / Pick & Drop">Document Submission / Pick & Drop</option>
  <option value="Medicine / Pharmacy Delivery">Medicine / Pharmacy Delivery</option>
  <option value="Laundry Pickup & Delivery">Laundry Pickup & Delivery</option>
  <option value="Food / Restaurant Delivery">Food / Restaurant Delivery</option>
  <option value="Flower / Gift Delivery">Flower / Gift Delivery</option>
</select>

        <textarea name="description" placeholder="Task Description" value={form.description} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location / Address" value={form.location} onChange={handleChange} />
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={handleChange} required />

        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
          <option>Cash on Delivery</option>
          <option>Online Payment</option>
        </select>

        {form.paymentMethod === "Online Payment" && (
          <select name="onlinePaymentOption" value={form.onlinePaymentOption} onChange={handleChange}>
            <option>UPI</option>
            <option>Card</option>
          </select>
          
        )}
        {form.paymentMethod === "Online Payment" && (
         <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={handleChange} required />

          
        )}
        <select name="urgency" value={form.urgency} onChange={handleChange}>
          <option>Normal</option>
          <option>Urgent</option>
        </select>

        
        <button type="submit">➕ Create Task</button>
      </form>

      {/* Filter */}
      <div className="filter-bar">
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <div key={t.id} className="task-card">
              <h3>{t.title}</h3>
              <p>{t.description || "No description"}</p>
              <p>📍 {t.location || "No location provided"}</p>
              <p>🕒 Deadline: {t.deadline || "N/A"}</p>
              <p>⚡ Urgency: {t.urgency || "Normal"}</p>
              <p>💰 ₹{t.price || 0}</p>
              <p>
                💳 Payment: {t.payment_method || "Cash on Delivery"}{" "}
                {t.payment_method === "Online Payment" && `(${t.online_payment_option})`} (
                {t.payment_status || "Unpaid"})
              </p>
              {t.image_url && (
                <p>🖼 Image: <a href={t.image_url} target="_blank" rel="noreferrer">View</a></p>
              )}
              <p>📌 Status: <span className={`status ${t.status?.toLowerCase() || "pending"}`}>{t.status || "Pending"}</span></p>

              <div className="task-actions">
                
                {t.status !== "Completed" && t.status !== "Cancelled" && <button onClick={() => handleCancel(t.id)}>❌ Cancel</button>}
              
                
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="no-task">No tasks found.</p>
        )}
      </div>

      {/* Review Modal */}
      {selectedTask && (
        <div className="review-modal">
          <div className="review-box">
            <h3>⭐ Review for {selectedTask.title}</h3>
            <select value={review.rating} onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}>
              <option value={0}>Select Rating</option>
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
            <textarea placeholder="Write your feedback..." value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
            <button onClick={() => handleReviewSubmit(selectedTask.id)}>Submit Review</button>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Task History Modal */}
      {historyTask && (
        <div className="review-modal">
          <div className="review-box">
            <h3>🕑 History for {historyTask.title}</h3>
            {loadingLogs ? (
              <p>Loading history...</p>
            ) : taskLogs.length > 0 ? (
              <ul>
                {taskLogs.map((log) => (
                  <li key={log.id}>
                    <strong>{log.role}</strong> ({log.updated_by}) : {log.old_status || "None"} → {log.new_status} <br />
                    📝 {log.remarks || "No remarks"} <br />
                    ⏰ {new Date(log.created_at).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No history found.</p>
            )}
            <button onClick={() => setHistoryTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
