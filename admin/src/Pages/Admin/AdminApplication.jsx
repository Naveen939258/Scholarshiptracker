import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../CSS/AdminApplication.css";

const API_BASE = process.env.REACT_APP_API_URL || "https://scholarshiptracker.onrender.com";

export default function AdminApplication() {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const token = localStorage.getItem("token");
  

  const COLORS = ["#1976d2", "#f57c00", "#388e3c", "#d32f2f", "#607d8b"];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/applications`, {
        headers: { "auth-token": token },
      });
      setApplications(res.data || []);
      setFilteredApps(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Compute stats
  const getStatusCounts = () => {
    const counts = {
      total: applications.length,
      approved: 0,
      rejected: 0,
      review: 0,
      submitted: 0,
      withdrawn: 0,
    };
    applications.forEach((a) => {
      switch (a.status) {
        case "Approved":
          counts.approved++;
          break;
        case "Rejected":
          counts.rejected++;
          break;
        case "Under Review":
          counts.review++;
          break;
        case "Submitted":
          counts.submitted++;
          break;
        case "Withdrawn":
          counts.withdrawn++;
          break;
        default:
          break;
      }
    });
    return counts;
  };

  const handleFilter = (status, query = search) => {
    let data = applications;
    if (status !== "All") data = data.filter((a) => a.status === status);
    if (query)
      data = data.filter((a) =>
        a.fullName.toLowerCase().includes(query.toLowerCase())
      );
    setFilteredApps(data);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleFilter(filterStatus, value);
  };

  const handleStatusChange = (status) => {
    setFilterStatus(status);
    handleFilter(status);
  };
const openStatusModal = (app, status) => {
    setSelectedApp(app);
    setNewStatus(status);
    setShowStatusModal(true);
  };
  const confirmStatusUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/applications/${selectedApp._id}/status`,
        { status: newStatus, message: adminMessage },
        { headers: { "auth-token": token } }
      );
      alert(`✅ Application ${newStatus}`);
      setShowStatusModal(false);
      setAdminMessage("");
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(applications);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "All_Applications.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Scholarship Applications Report", 14, 16);
    const tableData = applications.map((a, i) => [
      i + 1,
      a.fullName,
      a.email,
      a.scholarshipId?.name || "N/A",
      a.status,
      new Date(a.createdAt).toLocaleDateString(),
    ]);
    doc.autoTable({
      head: [["#", "Name", "Email", "Scholarship", "Status", "Applied On"]],
      body: tableData,
      startY: 22,
    });
    doc.save("Applications_Report.pdf");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted": return "status-submitted";
      case "Under Review": return "status-review";
      case "Approved": return "status-approved";
      case "Rejected": return "status-rejected";
      case "Withdrawn": return "status-withdrawn";
      default: return "";
    }
  };

  const getStatusStats = () => {
    const stats = {};
    applications.forEach((a) => {
      stats[a.status] = (stats[a.status] || 0) + 1;
    });
    return Object.entries(stats).map(([status, count]) => ({ status, count }));
  };

  if (loading)
    return (
      <div className="apps-page">
        <h3>Loading applications…</h3>
      </div>
    );

  const statusStats = getStatusStats();
  const counts = getStatusCounts();

  return (
    <div className="apps-page">
      <div className="apps-top">
        <h1>🎓 Scholarship Applications Dashboard</h1>
        <p>Monitor and manage all student applications efficiently.</p>
      </div>

      {/* ✅ STATS CARDS SECTION */}
      <div className="stats-cards">
        <div className="stat-card status-submitted">
          <h3>Total Applications</h3>
          <p>{counts.total}</p>
        </div>
        <div className="stat-card status-review">
          <h3>Under Review</h3>
          <p>{counts.review}</p>
        </div>
        <div className="stat-card status-approved">
          <h3>Approved</h3>
          <p>{counts.approved}</p>
        </div>
        <div className="stat-card status-rejected">
          <h3>Rejected</h3>
          <p>{counts.rejected}</p>
        </div>
        <div className="stat-card status-withdrawn">
          <h3>Withdrawn</h3>
          <p>{counts.withdrawn}</p>
        </div>
      </div>

      {/* 🔹 Charts Section */}
      <div className="charts-container">
        <div className="chart-box">
          <h3>Status Overview (Bar)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Status Distribution (Pie)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusStats}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {statusStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 Filter & Export */}
      <div className="admin-controls">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={search}
            onChange={handleSearch}
          />
          <select
            value={filterStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option>All</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Withdrawn</option>
          </select>
        </div>

        <div className="export-buttons">
          <button className="btn-primary" onClick={exportToExcel}>📊 Excel</button>
          <button className="btn-secondary" onClick={exportToPDF}>📄 PDF</button>
        </div>
      </div>

      {/* 🔹 Applications Table */}
      <div className="table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Scholarship</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>CGPA</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>No applications found</td></tr>
            ) : (
              filteredApps.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td>{a.scholarshipId?.name}</td>
                  <td>{a.fullName}</td>
                  <td>{a.email}</td>
                  <td>{a.cgpa}</td>
                  <td><span className={`status-badge ${getStatusColor(a.status)}`}>{a.status}</span></td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    
   <td>
  <button
    onClick={() => setSelected(a)}
    className="btn-outline"
    title="View Application"
  >
    View
  </button>

  {a.status !== "Withdrawn" && (
    <>
     
<button onClick={() => openStatusModal(a, "Under Review")} className="btn-review">Review</button>
                        <button onClick={() => openStatusModal(a, "Approved")} className="btn-success">Approve</button>
                        <button onClick={() => openStatusModal(a, "Rejected")} className="btn-danger">Reject</button>
    </>
  )}
</td>


                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal View */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal" onClick={() => setSelected(null)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selected.scholarshipId?.name}</h2>
                <button className="close1" onClick={() => setSelected(null)}>&times;</button>
              </div>
              <div className="modal-body scrollable">
                <h4>👤 Applicant Information</h4>
                <p><b>Name:</b> {selected.fullName}</p>
                <p><b>Email:</b> {selected.email}</p>
                <p><b>Mobile:</b> {selected.mobile}</p>
                <p><b>DOB:</b> {selected.dob}</p>
                <p><b>Gender:</b> {selected.gender}</p>
                <p><b>Institution:</b> {selected.institution}</p>
                <p><b>Course:</b> {selected.course}</p>
                <p><b>Year:</b> {selected.year}</p>
                <p><b>CGPA:</b> {selected.cgpa}</p>
                <p><b>Income:</b> ₹{selected.income}</p>
                <p><b>Father's Name:</b> {selected.fatherName}</p>
                <p><b>Occupation:</b> {selected.occupation}</p>
                <p><b>Address:</b> {selected.address}, {selected.state}, {selected.pincode}</p>
                <p><b>Bank:</b> {selected.bankName} ({selected.ifsc})</p>
                <p><b>Account Holder:</b> {selected.accountHolder}</p>
                <p><b>Account Number:</b> {selected.accountNumber}</p>

                <h4>📎 Documents</h4>
                {selected.documents ? (
                  <ul className="docs-list">
                    {Object.entries(selected.documents).map(([key, val]) =>
                      Array.isArray(val)
                        ? val.map((url, idx) => (
                            <li key={idx}>
                              <span>{key} {idx + 1}</span>
                              <a href={url} target="_blank" rel="noreferrer">View</a>
                            </li>
                          ))
                        : (
                          <li key={key}>
                            <span>{key}</span>
                            <a href={val} target="_blank" rel="noreferrer">View</a>
                          </li>
                        )
                    )}
                  </ul>
                ) : <p>No documents uploaded</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Application Status</h3>
              <button className="close1" onClick={() => setShowStatusModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>
                You are changing status to:
                <b style={{ color: "#1976d2" }}> {newStatus}</b>
              </p>
              <textarea
                rows="3"
                placeholder="Optional message (e.g., Missing documents, Verified info)"
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              ></textarea>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowStatusModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={confirmStatusUpdate}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
