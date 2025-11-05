import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleLoginStatusChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    handleLoginStatusChange();
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, []);

  return (
    <footer className="footer">
        {/* Columns */}
        <div className="footer-sections">
          <div className="footer-column">
            <h2>Scholarships</h2>
            <ul>
              <li><Link to="/scholarships">Browse Scholarships</Link></li>
              <li>{isLoggedIn ? <Link to="/applications">My Applications</Link> : <Link to="/login">My Applications</Link>}</li>
              <li><Link to="/news">News</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Support</h2>
            <ul>
              <li>{isLoggedIn ? <Link to="/profile">My Account</Link> : <Link to="/login">My Account</Link>}</li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Help / Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Resources</h2>
            <ul>
              <li><Link to="/guides">Application Guides</Link></li>
              <li><Link to="/eligibility">Eligibility Tips</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Company</h2>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom area: social + copyright */}
        <div className="footer-bottom">
        <div className="social-icons">
          <a
            href="https://www.instagram.com/accounts/login/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://www.linkedin.com/in/kakarla-naveen-2092411b3/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://wa.me/919392589802" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>

        <p>&copy; {new Date().getFullYear()} Online Donation Platform. All Rights Reserved.</p>
        <p className="sub-text">Together We Can Make a Difference ❤️</p>
      </div>
            </footer>
  );
};

export default Footer;
