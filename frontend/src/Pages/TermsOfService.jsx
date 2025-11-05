import React from "react";
import "./CSS/TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-page">
      <header className="terms-header">
        <h1>Terms of Service</h1>
        <p>Know your rights and obligations when using our platform.</p>
      </header>

      <section className="terms-container">
        <div className="terms-block">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our platform, you agree to these Terms of
            Service and our Privacy Policy.
          </p>
        </div>

        <div className="terms-block">
          <h2>2. User Responsibilities</h2>
          <ul>
            <li>Provide accurate and truthful information during registration.</li>
            <li>Do not misuse or attempt to breach platform security.</li>
            <li>Use the platform solely for legitimate scholarship purposes.</li>
          </ul>
        </div>

        <div className="terms-block">
          <h2>3. Intellectual Property</h2>
          <p>
            All content, branding, and platform design are property of our
            organization and protected by copyright law.
          </p>
        </div>

        <div className="terms-block">
          <h2>4. Termination Policy</h2>
          <p>
            We reserve the right to suspend or terminate access if any terms are
            violated.
          </p>
        </div>
      </section>

      <footer className="terms-footer">
        <p>Last updated: October 2025</p>
      </footer>
    </div>
  );
};

export default TermsOfService;
