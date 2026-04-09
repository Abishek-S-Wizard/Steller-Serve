import React, { useEffect, useState } from "react";
import "./ServiceDashboard.css";
import { fetchServiceTasks } from "../services/TaskService";
import {
  fetchServiceAverageRating,
  fetchSalariesByService,
} from "../services/AuthService";
import { supabase } from "../supabaseClient";

export default function Reports() {
  const [reportData, setReportData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalSalary: 0,
    paidSalary: 0,
    pendingSalary: 0,
  });

  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    async function loadReports() {
      try {
        
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const serviceId = profile?.id || user?.id;
        if (!serviceId) return;

        
        const tasks = await fetchServiceTasks(serviceId);

        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
          (t) => t.status === "Completed"
        ).length;

        const pendingTasks = tasks.filter(
          (t) => t.status !== "Completed" && t.status !== "Cancelled"
        ).length;

        const totalEarnings = tasks
          .filter((t) => t.status === "Completed")
          .reduce((sum, t) => sum + Number(t.price || 0), 0);

       
        const averageRating = await fetchServiceAverageRating(serviceId);

        
        const salaries = await fetchSalariesByService(serviceId);

        const totalSalary = salaries.reduce(
          (sum, s) => sum + Number(s.amount || 0),
          0
        );

        const paidSalary = salaries
          .filter((s) => s.status === "Paid")
          .reduce((sum, s) => sum + Number(s.amount || 0), 0);

        const pendingSalary = salaries
          .filter((s) => s.status !== "Paid")
          .reduce((sum, s) => sum + Number(s.amount || 0), 0);

        setReportData({
          totalTasks,
          completedTasks,
          pendingTasks,
          totalEarnings,
          averageRating,
          totalSalary,
          paidSalary,
          pendingSalary,
        });
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    }

    loadReports();
  }, []);

  return (
    <div className="reports-container">
      <h2>📊 Reports & Analytics</h2>

      <div className="report-cards">
        <div className="report-card">
          <h3>📝 Total Tasks</h3>
          <p>{reportData.totalTasks}</p>
        </div>

        <div className="report-card">
          <h3>✅ Completed</h3>
          <p>{reportData.completedTasks}</p>
        </div>

        <div className="report-card">
          <h3>⏳ Pending Tasks</h3>
          <p>{reportData.pendingTasks}</p>
        </div>

        <div className="report-card">
          <h3>💰 Task Earnings</h3>
          <p>₹{reportData.totalEarnings}</p>
        </div>

        <div className="report-card">
          <h3>⭐ Avg Rating</h3>
          <p>{reportData.averageRating}</p>
        </div>

        <div className="report-card">
          <h3>💼 Total Salary</h3>
          <p>₹{reportData.totalSalary}</p>
        </div>

        <div className="report-card">
          <h3>✅ Paid Salary</h3>
          <p>₹{reportData.paidSalary}</p>
        </div>

        <div className="report-card">
          <h3>⏳ Pending Salary</h3>
          <p>₹{reportData.pendingSalary}</p>
        </div>
      </div>
    </div>
  );
}
