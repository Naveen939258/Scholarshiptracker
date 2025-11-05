import React, { useState, useEffect } from "react";
import "./CSS/ScholarshipsPage.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ category: "", state: "", type: "" });
  const [compareList, setCompareList] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState([]);
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
const navigate = useNavigate();
const location = useLocation();
const params = new URLSearchParams(location.search);
const focusId = params.get("focus"); // 👈 comes from Dashboard redirect

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    upcoming: 0,
  });
const token = localStorage.getItem("token");


  // 🔹 Mock Data (Phase 1 + Phase 2)
 useEffect(() => {
  const fetchAllData = async () => {
    try {
      const userRes = await axios.get("http://localhost:5000/auth/me", {
        headers: { "auth-token": token },
      });
      setUser({
        name: userRes.data.username,
        email: userRes.data.email,
        phone: userRes.data.phone || "",
      });

      // ✅ Wait for both scholarships and applied list
      const [scholarRes, appliedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/scholarships", {
          headers: { "auth-token": token },
        }),
        axios.get("http://localhost:5000/api/applications/my", {
          headers: { "auth-token": token },
        }),
      ]);

      const appliedList = appliedRes.data.map((a) => a.scholarshipId?._id);
      setApplied(appliedList);

      const data = scholarRes.data.map((s) => ({
        id: s._id,
        name: s.name,
        provider: s.provider,
        category: s.category,
        amount: s.amount,
        deadline: s.deadline?.split("T")[0],
        state: s.state,
        type: s.type,
        description: s.description,
        eligibility: s.eligibility,
        status: s.status,
      }));

      const activeScholarships = data.filter((s) => s.status === "Active");
      setScholarships(activeScholarships);

      // ✅ Now update stats once both loaded
      updateStats(activeScholarships, appliedList);

      // ✅ Focus if redirected from Dashboard
      if (focusId && activeScholarships.length > 0) {
        const match = activeScholarships.find((s) => s.id === focusId);
        if (match) {
          setSelectedScholarship(match);
          setShowApplyModal(false);
          document.getElementById(match.id)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      alert("Failed to load scholarships or applications!");
    }
  };

  fetchAllData();
}, [focusId]);




  // 🔹 Update stats
  const updateStats = (list, appliedList = applied) => {
  const today = new Date();
  const upcoming = list.filter((s) => new Date(s.deadline) > today).length;

  setStats({
    total: list.length,
    applied: appliedList.length,
    upcoming,
  });
};


  // 🔹 Filter + Search
 const filteredScholarships = scholarships
  .filter((s) => s.status === "Active")
  .filter(
    (s) =>
      (!filter.category || s.category === filter.category) &&
      (!filter.state || s.state === filter.state) &&
      (!filter.type || s.type === filter.type) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );


  // 🔹 Compare toggle
  const toggleCompare = (s) => {
    if (compareList.some((item) => item.id === s.id)) {
      setCompareList(compareList.filter((item) => item.id !== s.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, s]);
    } else {
      alert("You can compare up to 3 scholarships only.");
    }
  };

  // 🔹 Apply Modal
  const handleApply = (s) => {
    setSelectedScholarship(s);
    setShowApplyModal(true);
  };

  // 🔹 Submit Application
  const submitApplication = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData(e.target);
    formData.append("scholarshipId", selectedScholarship.id);

    const res = await axios.post(
      "http://localhost:5000/api/applications/apply",
      formData,
      { headers: { "auth-token": token } }
    );

    alert("✅ Application submitted successfully!");
    setApplied([...applied, selectedScholarship]);
    updateStats(scholarships, [...applied, selectedScholarship.id]);
    setShowApplyModal(false);

    // redirect to applied details page
    navigate("/applied-application");
  } catch (err) {
    console.error("❌ Error submitting application:", err);
    alert("Failed to submit application!");
  }
};



  // 🔹 Clear filters
  const clearFilters = () => {
    setFilter({ category: "", state: "", type: "" });
  };

  return (
    <div className="scholarship-page">
      <header className="header">
        <h1>🎓 Scholarships Portal</h1>
        <p>Find, Apply, and Track all scholarships in one place.</p>
      </header>

      {/* 📊 Stats Section */}
      <section className="stats-section">
        <div className="stat-card blue">
          <h3>{stats.total}</h3>
          <p>Total Scholarships</p>
        </div>
        <div className="stat-card green">
          <h3>{stats.applied}</h3>
          <p>Applied</p>
        </div>
        <div className="stat-card yellow">
          <h3>{stats.upcoming}</h3>
          <p>Upcoming Deadlines</p>
        </div>
      </section>

      {/* 🔍 Search + Filter */}
      <section className="filters">
        <input
          type="text"
          placeholder="🔍 Search scholarships..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">Category</option>
          <option>Merit-Based</option>
          <option>Need-Based</option>
          <option>Women</option>
        </select>
        <select
          value={filter.state}
          onChange={(e) => setFilter({ ...filter, state: e.target.value })}
        >
          <option value="">State</option>
          <option>All India</option>
          <option>Andhra Pradesh</option>
          <option>Telangana</option>
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">Type</option>
          <option>Government</option>
          <option>Private</option>
        </select>
        <button className="btn-primary1" onClick={clearFilters}>
          Clear Filters
        </button>
      </section>

      {/* 🧾 Scholarship Cards */}
      <section className="scholarships-grid">
        {filteredScholarships.length === 0 ? (
          <p className="no-data">No scholarships found.</p>
        ) : (
          filteredScholarships.map((s) => (
            <div key={s.id} className="scholarship-card">
              <h3>{s.name}</h3>
              <p><b>Provider:</b> {s.provider}</p>
              <p><b>Amount:</b> ₹{s.amount}</p>
              <p><b>Deadline:</b> {s.deadline}</p>
              <p><b>Eligibility:</b> {s.eligibility}</p>
              <p><b>State:</b> {s.state}</p>

              <div className="card-buttons">
                <button
                  onClick={() => setSelectedScholarship(s)}
                  className="btn-secondary"
                >
                  View Details
                </button>
               <button
                  onClick={() => handleApply(s)}
                  className={`btn-primary ${applied.includes(s.id) ? "disabled" : ""}`}
                  disabled={applied.includes(s.id)}
                >
                  {applied.includes(s.id) ? "Applied" : "Apply"}
                </button>

                <button onClick={() => toggleCompare(s)} className="btn-remind">
                  {compareList.some((item) => item.id === s.id)
                    ? "Remove"
                    : "Compare"}
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* ⚖️ Compare Section */}
      {compareList.length > 0 && (
        <section className="compare-section">
          <h2>Compare Scholarships</h2>
          <div className="compare-grid">
            {compareList.map((s) => (
               <div key={s.id} id={s.id} className="scholarship-card">
                <h3>{s.name}</h3>
                <p>🏢 {s.provider}</p>
                <p>💰 ₹{s.amount}</p>
                <p>📅 Deadline: {s.deadline}</p>
                <p>📍 {s.state}</p>
                <p>{s.eligibility}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 📋 Scholarship Details Modal */}
      {selectedScholarship && !showApplyModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedScholarship.name}</h2>
            <p><b>Provider:</b> {selectedScholarship.provider}</p>
            <p><b>Eligibility:</b> {selectedScholarship.eligibility}</p>
            <p><b>Category:</b> {selectedScholarship.category}</p>
            <p><b>Type:</b> {selectedScholarship.type}</p>
            <p><b>State:</b> {selectedScholarship.state}</p>
            <p><b>Amount:</b> ₹{selectedScholarship.amount}</p>
            <p><b>Deadline:</b> {selectedScholarship.deadline}</p>
            <p>{selectedScholarship.description}</p>

            <div className="modal-actions">
              <button onClick={() => setShowApplyModal(true)} className="btn-primary">
                Apply Now
              </button>
              <button
  onClick={() => {
    setSelectedScholarship(null);
    setShowApplyModal(false);
  }}
  className="btn-secondary"
>
  Close
</button>

            </div>
          </div>
        </div>
      )}

      {/* 🧾 Apply Modal */}
{showApplyModal && selectedScholarship && (
  <div className="modal">
    <div className="modal-content apply-modal">
              <div className="modal-header">
              <h2>Apply for {selectedScholarship.name}</h2>
<button onClick={() => {setSelectedScholarship(null);
              setShowApplyModal(false);}}>&times;</button>
            </div>
      <form onSubmit={submitApplication} className="apply-form">
        {/* Personal Details */}
        <h3>Personal Details</h3>
        <label>Full Name</label>
<input
  type="text"
  name="fullName"
  value={user.name}
  readOnly
  className="readonly"
/>

<label>Email Address</label>
<input
  type="email"
  name="email"
  value={user.email}
  readOnly
  className="readonly"
/>

<label>Mobile Number</label>
<input
  type="tel"
  name="mobile"
  value={user.phone}
  readOnly
  className="readonly"
/>

        <label>Date of Birth</label>
        <input type="date" name="dob" required />

        <label>Gender</label>
        <select name="gender" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Academic Details */}
        <h3>Academic Details</h3>
        <label>University / Institution Name</label>
        <input
          type="text"
          name="institution"
          placeholder="Enter your institution name"
          required
        />

        <label>Course Name</label>
        <input type="text" name="course" placeholder="e.g., B.Tech, M.Sc, MBA" required />

        <label>Current Year of Study</label>
        <select name="year" required>
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <label>CGPA / Percentage</label>
        <input
          type="number"
          name="cgpa"
          placeholder="Enter CGPA or %"
          step="0.01"
          min="0"
          max="10"
          required
        />

        {/* Family & Financial Details */}
        <h3>Family & Financial Details</h3>
        <label>Annual Family Income (in INR)</label>
        <input type="number" name="income" placeholder="Enter total family income" required />

        <label>Father's Name</label>
        <input type="text" name="fatherName" placeholder="Enter father's name" required />

        <label>Occupation</label>
        <input type="text" name="occupation" placeholder="Enter parent's occupation" required />

        {/* Address Section */}
        <h3>Address Details</h3>
        <label>Permanent Address</label>
        <textarea
          name="address"
          rows="2"
          placeholder="Enter full permanent address"
          required
        ></textarea>

        <label>State</label>
        <select name="state" required>
          <option value="">Select State</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Telangana">Telangana</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Kerala">Kerala</option>
          <option value="Other">Other</option>
        </select>

        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          placeholder="Enter 6-digit pincode"
          pattern="[0-9]{6}"
          required
        />

        {/* Bank Details */}
        <h3>Bank Details</h3>
        <label>Account Holder Name</label>
        <input
          type="text"
          name="accountHolder"
          placeholder="Enter account holder name"
          required
        />

        <label>Bank Name</label>
        <input type="text" name="bankName" placeholder="Enter bank name" required />

        <label>Account Number</label>
        <input type="text" name="accountNumber" placeholder="Enter account number" required />

        <label>IFSC Code</label>
        <input type="text" name="ifsc" placeholder="Enter IFSC code" required />

        {/* Document Uploads */}
        <h3>Upload Required Documents</h3>
        <p className="note">Accepted formats: PDF, JPG, PNG (Max 2MB each)</p>

        <label>Student ID Proof</label>
        <input type="file" name="idProof" accept=".pdf,.jpg,.png" required />

        <label>Income Certificate</label>
        <input type="file" name="incomeCert" accept=".pdf,.jpg,.png" required />

        <label>Marksheets (Latest)</label>
        <input type="file" name="marksheets" multiple accept=".pdf,.jpg,.png" required />

        <label>Bonafide Certificate</label>
        <input type="file" name="bonafide" accept=".pdf,.jpg,.png" required />

        {/* Submit Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-primary full">
            Submit Application
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedScholarship(null);
              setShowApplyModal(false);
            }}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ScholarshipsPage;
