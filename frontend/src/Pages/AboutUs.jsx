import React from "react";
import "./CSS/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Scholarship Tracker</h1>
        <p>
          Bridging students and opportunities — our mission is to make every
          scholarship accessible, transparent, and tailored for every learner’s journey.
        </p>
      </section>

      {/* Journey Stats */}
      <section className="about-metrics">
        <div className="metric-card">
          <h3>8,000+</h3>
          <p>Scholarships Mapped</p>
        </div>
        <div className="metric-card">
          <h3>₹25 Cr+</h3>
          <p>Funds Distributed</p>
        </div>
        <div className="metric-card">
          <h3>70,000+</h3>
          <p>Active Students</p>
        </div>
        <div className="metric-card">
          <h3>🌐</h3>
          <p>Universities Partnered</p>
        </div>
      </section>

      {/* Mission, Vision, Core Values */}
      <section className="about-info">
        <div className="info-card">
          <h2>Our Mission</h2>
          <p>
            To empower students with the right scholarship information at the
            right time — simplifying discovery, eligibility, and tracking through
            innovative tools.
          </p>
        </div>

        <div className="info-card">
          <h2>Our Vision</h2>
          <p>
            To create an equitable academic ecosystem where every learner, 
            regardless of background, can access the support they deserve to achieve their goals.
          </p>
        </div>

        <div className="info-card">
          <h2>Our Core Values</h2>
          <ul>
            <li><b>Clarity:</b> Verified scholarships. No misinformation.</li>
            <li><b>Innovation:</b> AI-powered recommendation and tracking.</li>
            <li><b>Integrity:</b> Data privacy and fairness first.</li>
            <li><b>Empathy:</b> Built by students, for students.</li>
          </ul>
        </div>

        <div className="info-card">
          <h2>Our Team</h2>
          <p>
            A group of developers, educators, and dreamers passionate about
            enabling financial accessibility for education worldwide.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Track Your Future With Us 🚀</h2>
        <p>
          Join thousands of students discovering, applying, and succeeding
          through verified scholarships on Scholarship Tracker.
        </p>
        <a href="/scholarships" className="cta-btn">Start Tracking</a>
      </section>
    </div>
  );
};

export default AboutUs;
