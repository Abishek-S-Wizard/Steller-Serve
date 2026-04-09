
import React, { useEffect, useState } from "react";
import { fetchAllAttendance } from "../services/AuthService";
import "./AdminDashboard.css";

export default function AdminAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const records = await fetchAllAttendance();
      setAttendanceData(records);
      setFilteredData(records);
    } catch (err) {
      console.error("Error loading data:", err);
      alert(
        "Error loading data: " +
          (err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (!selectedDate) {
      setFilteredData(attendanceData);
    } else {
      const filtered = attendanceData.filter(
        (record) => record.date === selectedDate
      );
      setFilteredData(filtered);
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ["#", "Service Worker", "Email", "Date", "Status"],
      ...filteredData.map((r, idx) => [
        idx + 1,
        r.profiles?.name || "Unknown",
        r.profiles?.email || "Unknown",
        r.date,
        r.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">📑 Attendance Records</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Filter by Date: </label>
        <input type="date" value={filterDate} onChange={handleDateFilter} />
        <button onClick={exportCSV} style={{ marginLeft: "10px" }}>
          Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading attendance records...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Service Worker</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{record.profiles?.name || "Unknown"}</td>
                  <td>{record.profiles?.email || "Unknown"}</td>
                  <td>{record.date}</td>
                  <td
                    style={{
                      color:
                        record.status === "Present"
                          ? "green"
                          : record.status === "Absent"
                          ? "red"
                          : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {record.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
