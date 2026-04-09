
import React, { useEffect, useState } from "react";
import {
  fetchAllSalaries,
  fetchServiceWorkers,
  addSalaryRecord,
  updateSalaryStatus,
  deleteSalaryRecord,
} from "../services/AuthService";
import "./AdminDashboard.css";

export default function AdminSalary() {
  const [salaryData, setSalaryData] = useState([]);
  const [serviceWorkers, setServiceWorkers] = useState([]);
  const [newRecord, setNewRecord] = useState({
    serviceId: "",
    month: "",
    amount: "",
    status: "Pending",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salaries, workers] = await Promise.all([
        fetchAllSalaries(),
        fetchServiceWorkers(),
      ]);
      console.log("Fetched service workers:", workers); // 👀 Debug
      setSalaryData(salaries || []);
      setServiceWorkers(workers || []);
    } catch (err) {
      console.error("Error loading data:", err.message);
    }
  };

  const handleChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async () => {
    if (!newRecord.serviceId || !newRecord.month || !newRecord.amount) {
      alert("Please fill all fields!");
      return;
    }
    try {
      await addSalaryRecord(
        newRecord.serviceId,
        newRecord.month,
        parseInt(newRecord.amount),
        newRecord.status
      );
      setNewRecord({ serviceId: "", month: "", amount: "", status: "Pending" });
      loadData();
    } catch (err) {
      alert("Error adding record: " + err.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    await updateSalaryStatus(id, newStatus);
    loadData();
  };

  const handleRemove = async (id) => {
    await deleteSalaryRecord(id);
    loadData();
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">💰 Salary Management</h2>

      {/* Form to add salary */}
      <div className="form-section">
        <h3>Add Salary Record</h3>
        <select
          name="serviceId"
          value={newRecord.serviceId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Service Worker --</option>
          {serviceWorkers.length > 0 ? (
            serviceWorkers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name} ({worker.email})
              </option>
            ))
          ) : (
            <option disabled>No service workers found</option>
          )}
        </select>

        <select
  name="month"
  value={newRecord.month}
  onChange={handleChange}
>
  <option value="">-- Select Month --</option>
  <option value="January">January</option>
  <option value="February">February</option>
  <option value="March">March</option>
  <option value="April">April</option>
  <option value="May">May</option>
  <option value="June">June</option>
  <option value="July">July</option>
  <option value="August">August</option>
  <option value="September">September</option>
  <option value="October">October</option>
  <option value="November">November</option>
  <option value="December">December</option>
</select>

        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={newRecord.amount}
          onChange={handleChange}
        />
        <select name="status" value={newRecord.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
        <button onClick={handleAddRecord}>➕ Add Record</button>
      </div>

      {/* Salary Records Table */}
      <h3 className="admin-subtitle">📑 Salary Records</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Service Worker</th>
            <th>Month</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {salaryData.length > 0 ? (
            salaryData.map((record, index) => (
              <tr key={record.id}>
                <td>{index + 1}</td>
                <td>{record.profiles?.name || "Unknown"}</td>
                <td>{record.month}</td>
                <td>{record.amount}</td>
                <td
                  className={
                    record.status === "Paid" ? "status-paid" : "status-pending"
                  }
                >
                  {record.status}
                </td>
                <td>
                  <button onClick={() => toggleStatus(record.id, record.status)}>
                    {record.status === "Paid" ? "Mark Pending" : "Mark Paid"}
                  </button>
                  <button
                    onClick={() => handleRemove(record.id)}
                    className="btn-remove"
                  >
                    ❌ Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No salary records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
