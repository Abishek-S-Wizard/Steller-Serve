import React, { useEffect, useState } from "react";
import { fetchSalariesByService } from "../services/AuthService";
import { supabase } from "../supabaseClient";
import "./ServiceDashboard.css";

export default function Salary() {
  const [salaryRecords, setSalaryRecords] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const records = await fetchSalariesByService(user.id);
        setSalaryRecords(records);
      }
    };
    loadData();
  }, []);

  const totalEarnings = salaryRecords
    .filter((record) => record.status === "Paid")
    .reduce((acc, record) => acc + record.amount, 0);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">💰 Salary</h2>

      <div className="salary-summary">
        <h3>
          Total Earnings: <span>₹{totalEarnings}</span>
        </h3>
      </div>

      <h3 className="salary-subtitle">📑 Salary History</h3>
      <table className="salary-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Month</th>
            <th>Amount (₹)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {salaryRecords.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td>
              <td>{record.month}</td>
              <td>{record.amount}</td>
              <td
                className={
                  record.status === "Paid" ? "status-paid" : "status-pending"
                }
              >
                {record.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
