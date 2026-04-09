import React, { useEffect, useState } from "react";
import "./Overview.css";
import { fetchAllTasks } from "../services/TaskService";
import {
  fetchAllSalaries,
  fetchAllServiceTickets,
  fetchAllSupportTickets,
  fetchContactMessages,
} from "../services/AuthService";
import { supabase } from "../supabaseClient";

export default function Overview() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function loadOverview() {
      try {
        
        const { data: profiles, error: pErr } = await supabase
          .from("profiles")
          .select("id, role");

        if (pErr) throw pErr;

        const totalUsers = profiles.filter((p) => p.role === "user").length;
        const serviceProviders = profiles.filter(
          (p) => p.role === "service"
        ).length;

        
        const tasks = await fetchAllTasks();

        const activeJobs = tasks.filter(
          (t) =>
            t.status === "Pending" ||
            t.status === "Accepted" ||
            t.status === "In Progress"
        ).length;

        const completedJobs = tasks.filter(
          (t) => t.status === "Completed"
        ).length;

        const totalRevenue = tasks
          .filter((t) => t.status === "Completed")
          .reduce((sum, t) => sum + Number(t.price || 0), 0);

        
        const salaries = await fetchAllSalaries();

        const totalSalaryPaid = salaries
          .filter((s) => s.status === "Paid")
          .reduce((sum, s) => sum + Number(s.amount || 0), 0);

        const pendingSalary = salaries
          .filter((s) => s.status !== "Paid")
          .reduce((sum, s) => sum + Number(s.amount || 0), 0);

        
        const serviceTickets = await fetchAllServiceTickets();
        const userTickets = await fetchAllSupportTickets();
        const contactMessages = await fetchContactMessages();

        
        setStats([
          {
            id: 1,
            title: "Total Users",
            value: totalUsers,
            icon: "👤",
            color: "#3b82f6",
          },
          {
            id: 2,
            title: "Service Providers",
            value: serviceProviders,
            icon: "🛠",
            color: "#10b981",
          },
          {
            id: 3,
            title: "Active Jobs",
            value: activeJobs,
            icon: "📋",
            color: "#f59e0b",
          },
          {
            id: 4,
            title: "Completed Jobs",
            value: completedJobs,
            icon: "✅",
            color: "#8b5cf6",
          },
          {
            id: 5,
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: "💰",
            color: "#ef4444",
          },
          {
            id: 6,
            title: "Salary Paid (Services)",
            value: `₹${totalSalaryPaid.toLocaleString()}`,
            icon: "💼",
            color: "#22c55e",
          },
          {
            id: 7,
            title: "Pending Salary",
            value: `₹${pendingSalary.toLocaleString()}`,
            icon: "⏳",
            color: "#6366f1",
          },
          {
            id: 8,
            title: "Service Tickets",
            value: serviceTickets.length,
            icon: "🛠️",
            color: "#0ea5e9",
          },
          {
            id: 9,
            title: "User Support Tickets",
            value: userTickets.length,
            icon: "🎧",
            color: "#ec4899",
          },
          {
            id: 10,
            title: "Contact Messages",
            value: contactMessages.length,
            icon: "📩",
            color: "#14b8a6",
          },
        ]);
      } catch (err) {
        console.error("Admin overview error:", err);
      }
    }

    loadOverview();
  }, []);

  return (
    <div className="page">
      <h2>📊 Admin Dashboard Overview</h2>

      <div className="overview-grid">
        {stats.map((item) => (
          <div
            key={item.id}
            className="overview-card"
            style={{ borderTop: `5px solid ${item.color}` }}
          >
            <div className="overview-icon">{item.icon}</div>
            <div className="overview-info">
              <h3>{item.value}</h3>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
