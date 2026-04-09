import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { updateTaskStatus } from "../services/TaskService";
import "./ServiceTaskManagement.css";

export default function ServiceTaskManagement() {
  const [serviceId, setServiceId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          window.location.href = "/service-login";
          return;
        }
        setServiceId(user.id);
      } catch (err) {
        console.error("Error fetching service:", err.message);
        window.location.href = "/service-login";
      }
    };
    fetchService();
  }, []);

  
  const loadTasks = async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          profiles!tasks_user_id_fkey(id, name, email, phone)
        `)
        .eq("service_id", serviceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Service tasks fetched:", data); // Debugging

      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [serviceId]);

  
  const handleStatusChange = async (taskId, status) => {
    if (!serviceId) return;
    try {
      await updateTaskStatus(taskId, serviceId, status, "Updated by service");
      await loadTasks();
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  const handleCancel = (taskId) => {
    if (window.confirm("Cancel this task?")) handleStatusChange(taskId, "Cancelled");
  };

  
  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => (t.status || "Pending") === filter);

  return (
    <div className="service-task-container">
      <h2>🛠 Service Task Management</h2>
      <p className="subtitle">View and update tasks assigned to you</p>

      {loading && <p>Loading tasks...</p>}

      {/* ---------- Filter Bar ---------- */}
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

      {/* ---------- Task List ---------- */}
      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <div key={t.id} className="task-card">
              <h3>{t.title}</h3>
              <p>{t.description || "No description"}</p>
              <p>📍 <strong>Location:</strong> {t.location || "N/A"}</p>
              <p>🕒 <strong>Deadline:</strong> {t.deadline || "N/A"}</p>
              <p>⚡ <strong>Urgency:</strong> {t.urgency || "Normal"}</p>
              <p>💰 <strong>Price:</strong> ₹{t.price || 0}</p>
              <p>
                💳 <strong>Payment:</strong> {t.payment_method || "Cash on Delivery"}{" "}
                {t.payment_method === "Online Payment" && `(${t.online_payment_option})`}{" "}
                ({t.payment_status || "Unpaid"})
              </p>

              {/* ---------- User Info ---------- */}
              <p>👤 <strong>User:</strong> {t.profiles?.name || "N/A"}</p>
              <p>📧 <strong>Email:</strong> {t.profiles?.email || "N/A"}</p>
              <p>📞 <strong>Phone:</strong> {t.profiles?.phone || "N/A"}</p>

              {t.image_url && (
                <p>
                  🖼 <strong>Image:</strong>{" "}
                  <a href={t.image_url} target="_blank" rel="noreferrer">View</a>
                </p>
              )}

              <p>
                📌 <strong>Status:</strong>{" "}
                <span className={`status ${t.status?.toLowerCase() || "pending"}`}>{t.status || "Pending"}</span>
              </p>

              {/* ---------- Actions ---------- */}
              <div className="task-actions">
                {t.status === "Pending" && (
                  <button onClick={() => handleStatusChange(t.id, "Accepted")}>✅ Accept</button>
                )}
                {t.status === "Accepted" && (
                  <button onClick={() => handleStatusChange(t.id, "In Progress")}>▶ Start</button>
                )}
                {t.status === "In Progress" && (
                  <button onClick={() => handleStatusChange(t.id, "Completed")}>✔ Complete</button>
                )}
                {t.status !== "Completed" && t.status !== "Cancelled" && (
                  <button onClick={() => handleCancel(t.id)}>❌ Cancel</button>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="no-task">No tasks assigned to you.</p>
        )}
      </div>
    </div>
  );
}
