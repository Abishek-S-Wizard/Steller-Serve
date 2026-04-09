
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 
import "./AdminDashboard.css";

export default function JobManagement() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    status: "Pending",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error.message);
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location || !formData.salary) {
      alert("Please fill in all fields!");
      return;
    }

    const { data, error } = await supabase.from("jobs").insert([formData]).select();

    if (error) {
      console.error("Error adding job:", error.message);
      alert("Failed to add job!");
    } else {
      setJobs([data[0], ...jobs]); // add new job to state
      setFormData({ title: "", description: "", location: "", salary: "", status: "Pending" });
    }
  };

 
  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase.from("jobs").update({ status: newStatus }).eq("id", id);

    if (error) {
      console.error("Error updating status:", error.message);
    } else {
      setJobs(
        jobs.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
      );
    }
  };

  
  const handleRemoveJob = async (id) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting job:", error.message);
    } else {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  return (
    <div className="admin-section">
      <h2>🛠️ Job Management</h2>

      {/* Add Job Form */}
      <form className="admin-form" onSubmit={handleAddJob}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
        />
        <button type="submit">➕ Add Job</button>
      </form>

      {/* Jobs List */}
      <div className="list-section">
        <h3>📋 Jobs List</h3>
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs available.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Update</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.description}</td>
                  <td>{job.location}</td>
                  <td>₹{job.salary}</td>
                  <td>{job.status}</td>
                  <td>
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(job.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveJob(job.id)}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
