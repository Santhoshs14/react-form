import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("/api/user/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        alert("Failed to fetch user");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}</h1>
      <div className="details">
        <div className="detail">Email: {user.email}</div>
        <div className="detail">Phone: {user.number}</div>
        <div className="detail">Age: {user.age}</div>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
