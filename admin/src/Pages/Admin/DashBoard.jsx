// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/Dashboard.css";

const API_BASE = "https://scholarshiptracker.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    scholarships: 0,
    activeScholarships: 0,
    closedScholarships: 0,
    applications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    users: 0,
    activeUsers: 0,
    blockedUsers: 0,
    aiRecommendations: 0,
    topScholarships: [],
  });

  const token = localStorage.getItem("token");

  const fetchStats = useCallback(async () => {
    try {
      const [schRes, appRes, userRes, aiRes] = await Promise.all([
  axios.get(`${API_BASE}/api/admin/scholarships`, {
    headers: { "auth-token": token },
  }),
  axios.get(`${API_BASE}/api/admin/applications`, {
    headers: { "auth-token": token },
  }),
  axios.get(`${API_BASE}/admin/users`, {
    headers: { "auth-token": token },
  }),
  axios.get(`${API_BASE}/api/ai/recommendations`, {
    headers: { "auth-token": token },
  }),
]);


      const scholarships = schRes.data || [];
      const applications = appRes.data || [];
      const users = userRes.data || [];
      const recommendations = aiRes.data || [];

      const activeScholarships = scholarships.filter(
        (s) => s.status === "Active"
      ).length;
      const closedScholarships = scholarships.filter(
        (s) => s.status === "Closed"
      ).length;

      const pendingApplications = applications.filter(
        (a) => a.status === "Pending"
      ).length;
      const approvedApplications = applications.filter(
        (a) => a.status === "Approved"
      ).length;
      const rejectedApplications = applications.filter(
        (a) => a.status === "Rejected"
      ).length;

      const activeUsers = users.filter((u) => !u.isBlocked).length;
      const blockedUsers = users.filter((u) => u.isBlocked).length;

      const topScholarships = [...scholarships]
        .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
        .slice(0, 5);

      setStats({
        scholarships: scholarships.length,
        activeScholarships,
        closedScholarships,
        applications: applications.length,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        users: users.length,
        activeUsers,
        blockedUsers,
        aiRecommendations: recommendations.length,
        topScholarships,
      });
    } catch (err) {
      console.error("❌ Failed to fetch dashboard stats:", err);
    }
  }, [token]);

 useEffect(() => {
  fetchStats();
  const interval = setInterval(fetchStats, 60000); // every 1 min
  return () => clearInterval(interval);
}, [fetchStats]);


  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-icon">🎓</div>
        <h2>Admin Dashboard</h2>
        <p>Scholarship Tracker — Overview & Insights</p>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <div className="action-card create">
          <div className="action-icon">🎯➕</div>
          <h3>Create Scholarship</h3>
          <p>Launch new scholarship opportunities</p>
          <button
            className="action-btn create-btn"
            onClick={() => navigate("/scholarships")}
          >
            ➕ Add Scholarship
          </button>
        </div>

        <div className="action-card manage">
          <div className="action-icon">📋</div>
          <h3>Manage Applications</h3>
          <p>Approve, reject, or review student applications</p>
          <button
            className="action-btn manage-btn"
            onClick={() => navigate("/applications")}
          >
            ⚙ Manage Applications
          </button>
        </div>

        <div className="action-card manage">
          <div className="action-icon">👥</div>
          <h3>Manage Users</h3>
          <p>View or block/unblock student users</p>
          <button
            className="action-btn manage-btn"
            onClick={() => navigate("/users")}
          >
            ⚙ Manage Users
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid1">
        {/* Scholarships */}
        <div className="stat-card1"><h3>Total Scholarships</h3><p>{stats.scholarships}</p></div>
        <div className="stat-card1"><h3>Active Scholarships</h3><p>{stats.activeScholarships}</p></div>
        <div className="stat-card1"><h3>Closed Scholarships</h3><p>{stats.closedScholarships}</p></div>

        {/* Applications */}
        <div className="stat-card1"><h3>Total Applications</h3><p>{stats.applications}</p></div>
        <div className="stat-card1"><h3>Pending Applications</h3><p>{stats.pendingApplications}</p></div>
        <div className="stat-card1"><h3>Approved Applications</h3><p>{stats.approvedApplications}</p></div>
        <div className="stat-card1"><h3>Rejected Applications</h3><p>{stats.rejectedApplications}</p></div>

        {/* Users */}
        <div className="stat-card1"><h3>Total Users</h3><p>{stats.users}</p></div>
        <div className="stat-card1"><h3>Active Users</h3><p>{stats.activeUsers}</p></div>
        <div className="stat-card1"><h3>Blocked Users</h3><p>{stats.blockedUsers}</p></div>

        {/* AI Insights */}
        <div className="stat-card1"><h3>AI Recommendations</h3><p>{stats.aiRecommendations}</p></div>
      </div>

      {/* Top Scholarships */}
      <div className="top-campaigns">
        <h3>🏆 Top 5 Most Applied Scholarships</h3>
        <ul>
          {stats.topScholarships.map((s, i) => (
            <li key={i}>
  {s.name} — {s.applicationsCount || 0} Applications
</li>

          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
