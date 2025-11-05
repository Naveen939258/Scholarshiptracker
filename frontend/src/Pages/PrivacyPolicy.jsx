import React from "react";
import "./CSS/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <header className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>Your privacy matters — here’s how we protect it.</p>
      </header>

      <section className="privacy-content">
        <div className="privacy-section">
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal details such as your name, email, and documents
            for scholarship verification purposes. This data is stored securely
            and never shared with unauthorized third parties.
          </p>
        </div>

        <div className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process and verify scholarship applications.</li>
            <li>To send notifications and updates related to your account.</li>
            <li>To enhance our platform experience and user security.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>3. Data Security</h2>
          <p>
            We implement encryption and access control to ensure your personal
            data remains protected at all times.
          </p>
        </div>

        <div className="privacy-section">
          <h2>4. Your Rights</h2>
          <p>
            You can request data access, correction, or deletion at any time by
            contacting our support team.
          </p>
        </div>
      </section>

      <div className="privacy-cta">
        <h2>Need More Info?</h2>
        <p>Contact us if you have questions about our privacy practices.</p>
        <a href="/contact" className="btn-outline">Contact Support</a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
