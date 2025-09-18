import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await API.get("/leaves", config);
      setLeaves(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.put(`/leaves/${id}`, { status }, config);
      setMessage(`Leave ${status} successfully`);
      fetchLeaves();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating leave");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
      <table border="1">
        <thead>
          <tr>
            <th>Lecturer</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.user.name}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === "Pending" && (
                  <>
                    <button onClick={() => handleUpdate(leave._id, "Approved")}>Approve</button>
                    <button onClick={() => handleUpdate(leave._id, "Rejected")}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
