import React, { useState } from "react";
import API from "../services/api";

const LecturerDashboard = () => {
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await API.post("/leaves", leaveData, config);
      setMessage(`Leave applied successfully! Status: ${data.status}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error applying leave");
    }
  };

  return (
    <div>
      <h2>Lecturer Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label>Start Date:</label>
        <input type="date" name="startDate" value={leaveData.startDate} onChange={handleChange} required /><br/>

        <label>End Date:</label>
        <input type="date" name="endDate" value={leaveData.endDate} onChange={handleChange} required /><br/>

        <label>Reason:</label>
        <textarea name="reason" value={leaveData.reason} onChange={handleChange} required /><br/>

        <button type="submit">Apply Leave</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LecturerDashboard;
