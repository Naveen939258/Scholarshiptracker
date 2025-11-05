import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/Dashboard.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "Guest", email: "" });
  const [applications, setApplications] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [stats, setStats] = useState({
    totalScholarships: 0,
    activeApplications: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
const location = useLocation();
const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Fetch user details
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { "auth-token": token },
        });
        setUser({ name: res.data.username, email: res.data.email });
      } catch (err) {
        console.warn("⚠️ User fetch failed, using demo data:", err.message);
        setUser({ name: "Demo Student", email: "student@example.com" });
      }
    };

    // ✅ Fetch scholarship list
    const fetchScholarships = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/scholarships`, {
          headers: { "auth-token": token },
        });
        setScholarships(res.data || []);
        setStats((prev) => ({ ...prev, totalScholarships: res.data.length }));
      } catch (err) {
        console.warn("⚠️ Scholarships fetch failed, demo fallback:", err.message);
        const demo = [
          { _id: "1", name: "Merit Scholarship", amount: 25000 },
          { _id: "2", name: "Need-Based Scholarship", amount: 20000 },
        ];
        setScholarships(demo);
        setStats((prev) => ({ ...prev, totalScholarships: demo.length }));
      }
    };

    // ✅ Fetch user applications
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/applications/my`, {
          headers: { "auth-token": token },
        });
        const apps = res.data || [];
        setApplications(apps);

        // Count application statuses
        const approved = apps.filter((a) => a.status === "Approved").length;
        const rejected = apps.filter((a) => a.status === "Rejected").length;
        const active = apps.filter(
          (a) =>
            a.status === "Pending" ||
            a.status === "Under Review" ||
            a.status === "Submitted"
        ).length;

        setStats((prev) => ({
          ...prev,
          approvedCount: approved,
          rejectedCount: rejected,
          activeApplications: active,
        }));
      } catch (err) {
        console.warn("⚠️ Applications fetch failed, demo fallback:", err.message);
        const demoApps = [
          {
            _id: "a1",
            scholarshipName: "Merit Scholarship",
            status: "Approved",
            amount: 25000,
            appliedOn: "2025-01-15",
          },
        ];
        setApplications(demoApps);
        setStats((prev) => ({
          ...prev,
          approvedCount: 1,
          activeApplications: 0,
          rejectedCount: 0,
        }));
      }
    };

    // ✅ Fetch AI recommendations
    // ✅ Fetch AI recommendations
const fetchRecommendations = async () => {
  try {
    const token = localStorage.getItem("token");

    // Fetch user's applications
    const appsRes = await axios.get(`${API_BASE}/api/applications/my`, {
      headers: { "auth-token": token },
    });
    const userApplications = appsRes.data || [];
    const appliedIds = userApplications.map(a => a.scholarshipId?._id || a.scholarshipId);

    // Fetch recommendations from backend AI endpoint
    const res = await axios.get(`${API_BASE}/api/ai/recommendations`, {
      headers: { "auth-token": token },
    });

    let recs = res.data || [];

    // ✅ Remove already-applied scholarships from recommendations
    recs = recs.filter(r => !appliedIds.includes(r._id));

    // ✅ If no applications and no AI recs → fallback random active scholarships
    if (userApplications.length === 0 && recs.length === 0) {
      const allRes = await axios.get(`${API_BASE}/api/admin/scholarships`, {
        headers: { "auth-token": token },
      });
      const active = allRes.data.filter(s => s.status === "Active");

      const shuffled = active.sort(() => 0.5 - Math.random());
      recs = shuffled.slice(0, 5).map(s => ({
        _id: s._id,
        name: s.name,
        category: s.category || "General",
        amount: s.amount || "N/A",
        deadline: s.deadline || "N/A",
        match: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
        reason: "Top rated opportunity",
      }));
    }

    // ✅ Sort by best match
    recs = recs.sort((a, b) => b.match - a.match).slice(0, 5);
    setRecommendations(recs);
  } catch (err) {
    console.error("⚠️ Failed to fetch AI recommendations:", err.message);
    setRecommendations([]);
  }
};

    // Sequential data load
    fetchUser();
    fetchScholarships();
    fetchApplications();
    fetchRecommendations();
  }, []);

  // Match % color
  const getMatchColor = (match) => {
    if (match >= 90) return "green";
    if (match >= 70) return "orange";
    return "red";
  };

  return (
    <div className="dashboard-page">
      {/* Top Section */}
      <div className="dashboard-top">
        <div className="welcome-text">
          <h1>Welcome, {user.name}!</h1>
          <p>Track your scholarship applications and explore new opportunities 🎓</p>
        </div>
        <div className="user-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <h2>{stats.totalScholarships}</h2>
          <p>Total Scholarships</p>
        </div>
        <div className="stat-card yellow">
          <h2>{stats.activeApplications}</h2>
          <p>Active Applications</p>
        </div>
        <div className="stat-card green">
          <h2>{stats.approvedCount}</h2>
          <p>Approved</p>
        </div>
        <div className="stat-card red">
          <h2>{stats.rejectedCount}</h2>
          <p>Rejected</p>
        </div>
      </div>

      {/* Applications Section */}
      <div className="applications-section">
        <h2>Your Applications</h2>
        {applications.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No scholarship applications yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="application-box">
              <div className={`status-tag ${app.status.toLowerCase()}`}>
                {app.status}
              </div>
              <div className="application-details">
                <h3>{app.scholarshipName || app.scholarshipId?.name}</h3>
                <p><b>Amount:</b> ₹{app.amount || app.scholarshipId?.amount}</p>
                <p>
                  <b>Applied On:</b>{" "}
                  {new Date(app.appliedOn || app.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Recommendations Section */}
      
        {/* AI Recommendations Section */}
<div className="recommendations">
  <h2>
    AI Scholarship Recommendations <span className="badge">SMART</span>
  </h2>
  <div className="recs-grid">
    {recommendations.length === 0 ? (
      <p style={{ color: "#94a3b8" }}>No recommendations available</p>
    ) : (
      recommendations.map((rec, i) => (
        <div key={i} className="rec-card">
          <div className={`rec-header ${getMatchColor(rec.match)}`}>
            <span className="match">{rec.match}% Match</span>
          </div>
          <h3>{rec.name}</h3>
          <p><b>Category:</b> {rec.category || "General"}</p>
          <p><b>Amount:</b> ₹{rec.amount || "N/A"}</p>
          <p><b>Deadline:</b> {rec.deadline || "N/A"}</p>
          <p><b>Matched Criteria:</b> {rec.reason || "General eligibility"}</p>
          <button
            className="apply-btn"
onClick={() => navigate(`/scholarships?focus=${rec._id}`)}
          >
            Apply Now
          </button>
        </div>
      ))
    )}
  </div>
</div>

    </div>
  );
};

export default Dashboard;
