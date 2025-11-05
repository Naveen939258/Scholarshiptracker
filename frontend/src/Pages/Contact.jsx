import React, { useState } from "react";
import "./CSS/Contact.css";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="contact-page">
      {/* Page Title */}
      <h1 className="contact-title">📞 Get in Touch with Scholarship Support</h1>
      <p className="contact-subtitle">
        Have questions about scholarships, applications, or eligibility? We're here to help you.
      </p>

      {/* Tabs */}
      <div className="contact-tabs">
        <button
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat
        </button>
        <button
          className={activeTab === "email" ? "active" : ""}
          onClick={() => setActiveTab("email")}
        >
          📧 Email
        </button>
        <button
          className={activeTab === "call" ? "active" : ""}
          onClick={() => setActiveTab("call")}
        >
          📞 Call
        </button>
        <button
          className={activeTab === "office" ? "active" : ""}
          onClick={() => setActiveTab("office")}
        >
          📍 Office
        </button>
      </div>

      {/* Content */}
      <div className="contact-content">
        {activeTab === "chat" && (
          <div className="contact-box">
            <h3>Chat with Scholarship Support</h3>
            <p>
              Need quick help with scholarship registration or application status? Connect with us instantly via WhatsApp.
            </p>
            <p>
              🎓 Student Assistance:{" "}
              <a href="https://wa.me/919988776655" target="_blank" rel="noreferrer">
                <b>+91 99887 76655</b>
              </a>
            </p>
            <p>
              🏛️ University / Admin Help:{" "}
              <a href="https://wa.me/918899665544" target="_blank" rel="noreferrer">
                <b>+91 88996 65544</b>
              </a>
            </p>
          </div>
        )}

        {activeTab === "email" && (
          <div className="contact-box">
            <h3>Email Our Support Team</h3>
            <p>
              📩 General Queries:{" "}
              <a href="mailto:support@scholarshiptracker.org">
                <b>support@scholarshiptracker.org</b>
              </a>
            </p>
            <p>
              📝 Application / Document Help:{" "}
              <a href="mailto:helpdesk@scholarshiptracker.org">
                <b>helpdesk@scholarshiptracker.org</b>
              </a>
            </p>
            <p>
              🤝 Partner with Us:{" "}
              <a href="mailto:partnerships@scholarshiptracker.org">
                <b>partnerships@scholarshiptracker.org</b>
              </a>
            </p>
          </div>
        )}

        {activeTab === "call" && (
          <div className="contact-box">
            <h3>Call Our Support Line</h3>
            <p>☎️ Student Helpline: <b>1800-123-9876</b></p>
            <p>☎️ University & Admin Support: <b>1800-456-7890</b></p>
            <p className="contact-note">
              (Available Monday to Saturday, 9:00 AM – 6:00 PM IST)
            </p>
          </div>
        )}

        {activeTab === "office" && (
          <div className="contact-box">
            <h3>Visit Our Office</h3>
            <p>
              🏢 <b>Scholarship Tracker Headquarters</b><br />
              1st Floor,King House,near apollo medical shop<br />
              Green Fields,Jn road,Rajahmundry, Andhra Pradesh – 533103<br />
              📍 <a href="https://www.google.com/maps?q=sasi+jn.road,+Rajahmundry,+Andhra+Pradesh" 
                 target="_blank" rel="noreferrer">
                View on Google Maps
              </a>
            </p>
            <p>
              🕓 <b>Office Hours:</b> Monday – Saturday, 9:00 AM – 6:00 PM
            </p>
            <p>
              👨‍💼 <b>Contact Person:</b> Mr. Naveen Kakarla, Support Lead
            </p>
            <iframe
              title="Office Location"
              className="office-map"
              src="https://www.google.com/maps?q=sasi+jn.road,+Rajahmundry,+Andhra+Pradesh&output=embed"
              width="100%"
              height="250"
              style={{ border: "0", borderRadius: "12px", marginTop: "10px" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
