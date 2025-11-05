import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../CSS/AdminScholarships.css";

const AdminScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [stats, setStats] = useState({
    totalScholarships: 0,
    activeScholarships: 0,
    upcomingDeadlines: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [form, setForm] = useState({
    name: "",
    provider: "",
    category: "",
    amount: "",
    deadline: "",
    state: "",
    type: "",
    description: "",
    eligibility: "",
    status: "Active",
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch scholarships
  const fetchScholarships = useCallback(async () => {
    try {
      const res = await axios.get("https://scholarshiptracker.onrender.com/api/admin/scholarships", {
        headers: { "auth-token": token },
      });
      const data = res.data.map((s) => ({
        ...s,
        id: s._id, // normalize ID field for React key usage
      }));
      setScholarships(data);

      const today = new Date();
      const totalScholarships = data.length;
      const activeScholarships = data.filter((s) => s.status === "Active").length;
      const upcomingDeadlines = data.filter((s) => new Date(s.deadline) > today).length;

      setStats({ totalScholarships, activeScholarships, upcomingDeadlines });
    } catch (err) {
      console.error("❌ Failed to fetch scholarships:", err);
      alert("Failed to fetch scholarships!");
    }
  },[token]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.amount || !form.deadline) {
      alert("⚠ Please fill all required fields!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `https://scholarshiptracker.onrender.com/api/admin/scholarships/${editingId}`,
          form,
          { headers: { "auth-token": token } }
        );
        alert("✅ Scholarship updated successfully!");
      } else {
        await axios.post("https://scholarshiptracker.onrender.com/api/admin/scholarships", form, {
          headers: { "auth-token": token },
        });
        alert("✅ Scholarship created successfully!");
      }

      // Reset form
      setForm({
        name: "",
        provider: "",
        category: "",
        amount: "",
        deadline: "",
        state: "",
        type: "",
        description: "",
        eligibility: "",
        status: "Active",
      });
      setEditingId(null);
      setShowModal(false);
      fetchScholarships();
    } catch (err) {
      console.error("❌ Failed to save scholarship:", err.response?.data || err.message);
      alert("❌ Failed to save scholarship!");
    }
  };

  const handleEdit = (scholarship) => {
    setForm({
      name: scholarship.name || "",
      provider: scholarship.provider || "",
      category: scholarship.category || "",
      amount: scholarship.amount || "",
      deadline: scholarship.deadline?.split("T")[0] || "",
      state: scholarship.state || "",
      type: scholarship.type || "",
      description: scholarship.description || "",
      eligibility: scholarship.eligibility || "",
      status: scholarship.status || "Active",
    });
    setEditingId(scholarship.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      await axios.delete(`https://scholarshiptracker.onrender.com/api/admin/scholarships/${id}`, {
        headers: { "auth-token": token },
      });
      alert("🗑 Scholarship deleted successfully!");
      fetchScholarships();
    } catch (err) {
      console.error("❌ Failed to delete scholarship:", err.response?.data || err.message);
      alert("❌ Failed to delete scholarship!");
    }
  };

  const toggleStatus = async (s) => {
    const updatedStatus = s.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(
        `https://scholarshiptracker.onrender.com/api/admin/scholarships/${s.id}/status`,
        { status: updatedStatus },
        { headers: { "auth-token": token } }
      );
      alert(`Scholarship ${updatedStatus}`);
      fetchScholarships();
    } catch (err) {
      console.error("❌ Failed to toggle status:", err.response?.data || err.message);
      alert("❌ Failed to change scholarship status!");
    }
  };

  return (
    <div className="scholarship-page">
      {/* Header */}
      <div className="plans-header">
        <h2>Scholarships Management</h2>
        <button
          className="create-btn"
          onClick={() => {
            setForm({
              name: "",
              provider: "",
              category: "",
              amount: "",
              deadline: "",
              state: "",
              type: "",
              description: "",
              eligibility: "",
              status: "Active",
            });
            setEditingId(null);
            setShowModal(true);
          }}
        >
          + Create New Scholarship
        </button>
      </div>

      {/* Stats */}
      <div className="plans-stats">
        <div className="stat-card">🎓 <p>Total Scholarships</p><h3>{stats.totalScholarships}</h3></div>
        <div className="stat-card active">✅ <p>Active</p><h3>{stats.activeScholarships}</h3></div>
        <div className="stat-card yellow">📅 <p>Upcoming Deadlines</p><h3>{stats.upcomingDeadlines}</h3></div>
      </div>

      {/* Scholarships Grid */}
      <div className="plans-grid">
        {scholarships.length > 0 ? (
          scholarships.map((s) => (
            <div key={s.id} className="plan-card">
              <div className="plan-card-top">
                <h3>{s.name}</h3>
                <p className="plan-type">{s.category}</p>
                <h2 className="plan-price">₹{s.amount}</h2>
              </div>
              <div className="plan-card-bottom">
                <p><b>Provider:</b> {s.provider}</p>
                <p><b>Deadline:</b> {s.deadline}</p>
                <p><b>Type:</b> {s.type}</p>
                <p><b>State:</b> {s.state}</p>
                <p><b>Status:</b> {s.status}</p>
                <p><b>Eligibility:</b> {s.eligibility}</p>
                <p><b>Applications Received:</b> {s.applicationsCount || 0}</p>

                <div className="plan-actions">
                  <button className="edit-btn" onClick={() => handleEdit(s)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
                  <button className="details-btn" onClick={() => setShowDetails(s)}>View Details</button>
                  <button
                    className={s.status === "Active" ? "deactivate-btn" : "activate-btn"}
                    onClick={() => toggleStatus(s)}
                  >
                    {s.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No scholarships available</p>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{showDetails.name}</h3>
              <button onClick={() => setShowDetails(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><b>Provider:</b> {showDetails.provider}</p>
              <p><b>Category:</b> {showDetails.category}</p>
              <p><b>Amount:</b> ₹{showDetails.amount}</p>
              <p><b>Deadline:</b> {showDetails.deadline}</p>
              <p><b>Type:</b> {showDetails.type}</p>
              <p><b>State:</b> {showDetails.state}</p>
              <p><b>Status:</b> {showDetails.status}</p>
              <p><b>Eligibility:</b> {showDetails.eligibility}</p>
              <p>{showDetails.description}</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDetails(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingId ? "Edit Scholarship" : "Create New Scholarship"}</h3>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form className="plan-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Scholarship Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Provider</label>
                  <input name="provider" value={form.provider} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Merit-Based">Merit-Based</option>
                    <option value="Need-Based">Need-Based</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Deadline</label>
                  <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Eligibility</label>
                  <input
                    name="eligibility"
                    value={form.eligibility}
                    onChange={handleChange}
                    placeholder="Enter eligibility criteria"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter scholarship description"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScholarships;
