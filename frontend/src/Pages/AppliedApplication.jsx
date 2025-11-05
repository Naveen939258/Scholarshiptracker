import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/AppliedApplication.css";

const AppliedApplication = () => {
  const [latestApp, setLatestApp] = useState(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("https://scholarshiptracker.onrender.com/api/applications/my", {
          headers: { "auth-token": token },
        });
        const data = res.data || [];

        if (data.length > 0) {
          // Sort to get the most recent
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLatestApp(sorted[0]);
        }
      } catch (err) {
        console.error("❌ Failed to load applications:", err);
        alert("Failed to fetch your latest application");
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="applied-page">
      <h1 className="applied-title">✅ Application Submitted Successfully!</h1>

      {!latestApp ? (
        <p>No applications found.</p>
      ) : (
        <div className="application-card">
          <h3>📄 Scholarship: {latestApp.scholarshipId?.name}</h3>
          <p><b>Provider:</b> {latestApp.scholarshipId?.provider}</p>
          <p><b>Category:</b> {latestApp.scholarshipId?.category}</p>
          <p><b>Amount:</b> ₹{latestApp.scholarshipId?.amount}</p>
          <p><b>Deadline:</b> {latestApp.scholarshipId?.deadline?.split("T")[0]}</p>

          <hr className="divider" />

          <h4>👤 Applicant Details</h4>
          <p><b>Name:</b> {latestApp.fullName}</p>
          <p><b>Email:</b> {latestApp.email}</p>
          <p><b>Phone:</b> {latestApp.mobile}</p>
          <p><b>DOB:</b> {latestApp.dob}</p>
          <p><b>Gender:</b> {latestApp.gender}</p>

          <hr className="divider" />

          <h4>🎓 Academic Info</h4>
          <p><b>Institution:</b> {latestApp.institution}</p>
          <p><b>Course:</b> {latestApp.course}</p>
          <p><b>Year:</b> {latestApp.year}</p>
          <p><b>CGPA:</b> {latestApp.cgpa}</p>

          <hr className="divider" />

          <h4>💰 Financial Info</h4>
          <p><b>Income:</b> ₹{latestApp.income}</p>
          <p><b>Father's Name:</b> {latestApp.fatherName}</p>
          <p><b>Occupation:</b> {latestApp.occupation}</p>

          <hr className="divider" />

          <h4>🏦 Bank Info</h4>
          <p><b>Bank:</b> {latestApp.bankName}</p>
          <p><b>Account No:</b> {latestApp.accountNumber}</p>
          <p><b>IFSC:</b> {latestApp.ifsc}</p>

          <p className={`status ${
            latestApp.status === "Submitted"
              ? "status-success"
              : latestApp.status === "Pending"
              ? "status-pending"
              : "status-failed"
          }`}>
            <b>Status:</b> {latestApp.status}
          </p>

          <div className="applied-buttons">
            <a href="/" className="btn-home">🏠 Go to Home</a>
            <a href="/scholarships" className="btn-campaigns">🎓 View Scholarships</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedApplication;
