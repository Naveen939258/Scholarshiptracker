import React, { useState, useEffect } from "react";
import "../CSS/AdminProfile.css";
import {
  FaUserEdit,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaCogs,
} from "react-icons/fa";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://scholarshiptracker.onrender.com";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeScholarships: 0,
    pendingApprovals: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { "auth-token": token },
        });
        setAdminData(res.data);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // ✅ Fetch dynamic admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [schRes, appRes, notifRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/scholarships`, {
            headers: { "auth-token": token },
          }),
          axios.get(`${API_BASE}/api/admin/applications`, {
            headers: { "auth-token": token },
          }),
          axios.get(`${API_BASE}/api/admin/notifications`, {
            headers: { "auth-token": token },
          }),
        ]);

        const scholarships = schRes.data || [];
        const applications = appRes.data || [];
        const notifications = notifRes.data || [];

        const activeScholarships = scholarships.filter(
          (s) => s.status === "Active"
        ).length;
        const pendingApprovals = applications.filter(
          (a) => a.status === "Pending" || a.status === "Under Review"
        ).length;

        setStats({
          totalApplications: applications.length,
          activeScholarships,
          pendingApprovals,
          notifications: notifications.length,
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    fetchStats();
  }, [token]);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentPassword) {
      alert("Please enter your current password to save changes.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", adminData.username);
      formData.append("email", adminData.email);
      formData.append("phone", adminData.phone);
      formData.append("currentPassword", currentPassword);

      const res = await axios.put(`${API_BASE}/auth/me`, formData, {
        headers: { "auth-token": token },
      });

      alert("✅ Profile updated successfully!");
      setAdminData(res.data);
      setIsEditing(false);
      setCurrentPassword("");
    } catch (err) {
      console.error("Profile update failed:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to update profile.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!adminData) return <div>No admin data found.</div>;

  return (
    <div className="admin-profile-page">
      {/* HEADER */}
      <header className="admin-profile-header">
        <div className="admin-info">
          <img
            src={
              adminData.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Admin"
            className="admin-avatar"
          />
          <div>
            <h1>{adminData.username}</h1>
            <p>{adminData.organization || "ScholarHub Foundation"}</p>
          </div>
        </div>

        <button
          className="edit-btn"
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
        >
          <FaUserEdit /> {isEditing ? "Save" : "Edit Profile"}
        </button>
      </header>

      {/* ✅ DYNAMIC STATS */}
      <section className="admin-stats">
        <div className="stat-card">
          <h2>{stats.totalApplications}</h2>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h2>{stats.activeScholarships}</h2>
          <p>Active Scholarships</p>
        </div>
        <div className="stat-card">
          <h2>{stats.pendingApprovals}</h2>
          <p>Pending Approvals</p>
        </div>
        <div className="stat-card">
          <h2>{stats.notifications}</h2>
          <p>Admin Messages</p>
        </div>
      </section>

      {/* DETAILS */}
      <section className="admin-details">
        <h2>Personal Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <FaEnvelope />
            <input
              type="email"
              name="email"
              value={adminData.email}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>
          <div className="detail-item">
            <FaPhone />
            <input
              type="text"
              name="phone"
              value={adminData.phone || "9392589802"}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>
          <div className="detail-item">
            <FaUniversity />
            <input
              type="text"
              name="department"
              value={adminData.department || "Scholarship Management"}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>
          <div className="detail-item">
            <FaCogs />
            <input
              type="text"
              name="organization"
              value={adminData.organization || "ScholarHub Foundation"}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

        {isEditing && (
          <div className="password-field">
            <input
              type="password"
              placeholder="Enter current password to save changes"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* ✅ RECENT ACTIVITY */}
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Approved {stats.pendingApprovals} scholarship applications.</li>
          <li>Currently managing {stats.activeScholarships} active scholarships.</li>
          <li>Total {stats.totalApplications} applications received.</li>
          <li>Sent {stats.notifications} admin messages.</li>
        </ul>
      </section>
    </div>
  );
};

export default AdminProfile;
