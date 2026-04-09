
import React, { useEffect, useState } from "react";
import {
  markAttendance,
  removeAttendance,
  fetchServiceAttendance,
} from "../services/AuthService";
import { supabase } from "../supabaseClient";
import "./Attendance.css";

export default function ServiceAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [serviceId, setServiceId] = useState(null);

  
  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        alert("Error fetching user info: " + JSON.stringify(error));
        return;
      }
      if (!data.user) {
        alert("User not logged in.");
        return;
      }
      setServiceId(data.user.id);
    };
    fetchUserId();
  }, []);

  
  useEffect(() => {
    if (!serviceId) return;
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const records = await fetchServiceAttendance(serviceId);
      setAttendanceData(records);
    } catch (err) {
      console.error("Error loading attendance:", err);
      alert(
        "Error loading attendance: " +
          (err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!serviceId) return alert("Service ID not found. Please login again.");
    if (!selectedDate) return alert("Select a date!");

    try {
      await markAttendance(serviceId, selectedDate, status);
      setSelectedDate("");
      loadData();
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert(
        "Error marking attendance: " +
          (err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)))
      );
    }
  };

  const handleRemove = async (date) => {
    if (!serviceId) return alert("Service ID not found. Please login again.");
    try {
      await removeAttendance(serviceId, date);
      loadData();
    } catch (err) {
      console.error("Error removing attendance:", err);
      alert(
        "Error removing attendance: " +
          (err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)))
      );
    }
  };

  if (!serviceId) {
    return <p>Loading user info...</p>;
  }

  return (
    <div>
      <h2>📅 Mark Attendance</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>
      <button onClick={handleAdd}>Add / Update</button>

      {loading ? (
        <p>Loading attendance records...</p>
      ) : (
        <>
          <h3>Attendance Records</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record, idx) => (
                  <tr key={record.id}>
                    <td>{idx + 1}</td>
                    <td>{record.date}</td>
                    <td>{record.status}</td>
                    <td>
                      <button onClick={() => handleRemove(record.date)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
        