import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { assignTask, updateTaskStatus } from "../services/TaskService";
import "./AdminTaskManagement.css";

export default function AdminTaskManagement() {
  const [adminId] = useState("6404fbb4-b28a-4b16-93e0-7513bbafb6cd");
  const [tasks, setTasks] = useState([]);
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  /* ---------- Load Tasks ---------- */
  const loadTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          profiles!tasks_user_id_fkey(id, name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /* ---------- Load Services (with servicetype) ---------- */
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, servicetype")
          .eq("role", "service");

        if (error) throw error;
        setServices(data);
      } catch (err) {
        console.error("Failed to load services:", err.message);
      }
    };
    loadServices();
  }, []);

  /* ---------- Assign Worker ---------- */
  const handleAssignWorker = async (taskId, serviceId, e) => {
    if (!serviceId) return;
    try {
      await assignTask(taskId, adminId, serviceId);
      alert("✅ Task assigned to service");
      e.target.value = "";
      await loadTasks();
    } catch (err) {
      console.error("Failed to assign task:", err.message);
    }
  };

  /* ---------- Update Status ---------- */
  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, adminId, status, "Updated by admin");
      await loadTasks();
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  const handleCancel = (taskId) => {
    if (window.confirm("Cancel this task?")) {
      handleStatusChange(taskId, "Cancelled");
    }
  };

  /* ---------- Filter Tasks ---------- */
  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => (t.status || "Pending") === filter);

  return (
    <div className="task-container">
      <h2>🛠 Admin Task Management</h2>
      <p className="subtitle">
        Assign tasks to service workers and monitor progress
      </p>

      {loading && <p>Loading tasks...</p>}

      {/* ---------- Filter ---------- */}
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
          filteredTasks.map((t) => {
            const isLocked =
              t.status === "Completed" || t.status === "Cancelled";

            return (
              <div key={t.id} className="task-card">
                <h3>{t.title}</h3>
                <p>{t.description || "No description"}</p>

                <p>📍 <strong>Location:</strong> {t.location || "N/A"}</p>
                <p>🕒 <strong>Deadline:</strong> {t.deadline || "N/A"}</p>
                <p>⚡ <strong>Urgency:</strong> {t.urgency || "Normal"}</p>

                <p>
                  💳 <strong>Payment:</strong>{" "}
                  {t.payment_method || "Cash on Delivery"}{" "}
                  {t.payment_method === "Online Payment" &&
                    `(${t.online_payment_option})`}{" "}
                  ({t.payment_status || "Unpaid"})
                </p>

                {/* ---------- User Info ---------- */}
                <p>👤 <strong>User Name:</strong> {t.profiles?.name || "N/A"}</p>
                <p>📧 <strong>Email:</strong> {t.profiles?.email || "N/A"}</p>

                {t.image_url && (
                  <p>
                    🖼 <strong>Image:</strong>{" "}
                    <a href={t.image_url} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </p>
                )}

                <p>
                  📌 <strong>Status:</strong>{" "}
                  <span
                    className={`status ${
                      t.status?.toLowerCase() || "pending"
                    }`}
                  >
                    {t.status || "Pending"}
                  </span>
                </p>

                {/* ---------- Admin Actions ---------- */}
                <div className="task-actions">
                  <div className="assign-section">
                    <label>
                      Assign Worker{" "}
                      {isLocked && (
                        <span style={{ color: "#888", fontSize: "12px" }}>
                          (Disabled)
                        </span>
                      )}
                    </label>

                    <select
                      onChange={(e) =>
                        handleAssignWorker(t.id, e.target.value, e)
                      }
                      defaultValue=""
                      disabled={isLocked}
                    >
                      <option value="">Select Service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.servicetype ? `(${s.servicetype})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {t.status === "In Progress" && (
                    <button
                      onClick={() =>
                        handleStatusChange(t.id, "Completed")
                      }
                    >
                      ✔ Complete
                    </button>
                  )}

                  {t.status !== "Completed" &&
                    t.status !== "Cancelled" && (
                      <button onClick={() => handleCancel(t.id)}>
                        ❌ Cancel
                      </button>
                    )}
                </div>
              </div>
            );
          })
        ) : (
          !loading && <p className="no-task">No tasks found.</p>
        )}
      </div>
    </div>
  );
}
