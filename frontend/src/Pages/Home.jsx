import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="home">
      {/* 🌟 HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Empowering Dreams Through Scholarships</h1>
          <p>Discover, apply, and track scholarships that can change your future.</p>

          <div className="hero-buttons">
            <Link to="/scholarships" className="btn-primary">
              Explore Scholarships
            </Link>
            <Link to="#" className="btn-secondary" onClick={handleGetStarted}>
              Get Started
            </Link>
          </div>
        </div>
        {/* 📰 Scrolling Updates — merged inside hero */}
        <div className="scroll-section">
          <div className="scroll-content">
            <span>🎓 New Scholarships Added for 2025!</span>
            <span>💰 Over ₹5 Crores Distributed to Students!</span>
            <span>🌍 Join 10,000+ Students Across India!</span>
            <span>📅 Upcoming Deadline: Merit-Based Scholarships – Nov 15</span>
            <span>⚡ Apply Now and Track Instantly on Dashboard!</span>
          </div>
        </div>
      </section>

      {/* 📊 Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>500+</h3>
            <p>Active Scholarships</p>
          </div>
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Students Supported</p>
          </div>
          <div className="stat-card">
            <h3>₹5 Cr+</h3>
            <p>Funds Distributed</p>
          </div>
          <div className="stat-card">
            <h3>🌍</h3>
            <p>Nationwide Reach</p>
          </div>
        </div>
      </section>

      {/* 💡 Features Section */}
      <section className="features">
        <h2>Why Use Scholarship Tracker?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎓 Verified Scholarships</h3>
            <p>All opportunities are verified to ensure authenticity and accuracy.</p>
          </div>
          <div className="feature-card">
            <h3>🕒 Smart Application Tracking</h3>
            <p>Keep track of all your applied scholarships and their status in one place.</p>
          </div>
          <div className="feature-card">
            <h3>💡 Personalized Recommendations</h3>
            <p>Get scholarship suggestions that match your profile and academic goals.</p>
          </div>
        </div>
      </section>

      {/* 🚀 Call to Action Section */}
      <section className="cta">
        <h2>Start Your Scholarship Journey Today</h2>
        <p>Join thousands of students who have unlocked new opportunities with Scholarship Tracker.</p>
        <div className="cta-buttons">
          <Link to="/scholarships" className="btn-primary">
            Find Scholarships
          </Link>
          <Link to="/scholarships" className="btn-primary">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
