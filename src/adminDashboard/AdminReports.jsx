import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../supabaseClient";
import { fetchAllTasks } from "../services/TaskService";

export default function Reports() {
  const [summary, setSummary] = useState({
    users: 0,
    services: 0,
    completedJobs: 0,
    revenue: 0,
  });

  const [jobsData, setJobsData] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);

  const COLORS = ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#9b59b6"];

  useEffect(() => {
    async function loadReports() {
      try {
        
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, role");

        const users = profiles.filter((p) => p.role === "user").length;
        const services = profiles.filter((p) => p.role === "service").length;

        
        const tasks = await fetchAllTasks();

        const completedTasks = tasks.filter(
          (t) => t.status === "Completed"
        );

        const revenue = completedTasks.reduce(
          (sum, t) => sum + Number(t.price || 0),
          0
        );

        
        const monthMap = {};

        tasks.forEach((task) => {
          const date = new Date(task.created_at);
          const month = date.toLocaleString("default", { month: "short" });

          if (!monthMap[month]) {
            monthMap[month] = { month, completed: 0, pending: 0 };
          }

          if (task.status === "Completed") {
            monthMap[month].completed += 1;
          } else {
            monthMap[month].pending += 1;
          }
        });

        setJobsData(Object.values(monthMap));

        
        const serviceMap = {};

        tasks.forEach((task) => {
          const type = task.service_type || "Other";
          serviceMap[type] = (serviceMap[type] || 0) + 1;
        });

        setServiceDistribution(
          Object.keys(serviceMap).map((key) => ({
            name: key,
            value: serviceMap[key],
          }))
        );

        
        setSummary({
          users,
          services,
          completedJobs: completedTasks.length,
          revenue,
        });
      } catch (err) {
        console.error("Admin reports error:", err);
      }
    }

    loadReports();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">📊 Reports & Analytics</h2>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="reports-summary">
        <div className="report-card">
          <h3>Total Users</h3>
          <p>{summary.users}</p>
        </div>

        <div className="report-card">
          <h3>Service Workers</h3>
          <p>{summary.services}</p>
        </div>

        <div className="report-card">
          <h3>Jobs Completed</h3>
          <p>{summary.completedJobs}</p>
        </div>

        <div className="report-card">
          <h3>Total Revenue</h3>
          <p>₹{summary.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      <h3 className="admin-subtitle">📅 Monthly Jobs Report</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jobsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#2ecc71" />
            <Bar dataKey="pending" fill="#e74c3c" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE CHART ================= */}
      <h3 className="admin-subtitle">🛠 Service Type Distribution</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={serviceDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {serviceDistribution.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
