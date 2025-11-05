import React, { useState } from "react";
import "./CSS/FAQ.css";

const faqData = {
  "Scholarship Applications": [
    {
      q: "How can I apply for a scholarship?",
      a: "Go to the 'Scholarships' page, choose a scholarship that matches your eligibility, and click the 'Apply Now' button to submit your application.",
    },
    {
      q: "Can I apply for multiple scholarships at once?",
      a: "Yes, students can apply for multiple scholarships as long as they meet the eligibility criteria for each one.",
    },
    {
      q: "What documents are required for application?",
      a: "Commonly required documents include your academic transcripts, ID proof, income certificate, and a recent photograph. Specific scholarships may have additional requirements.",
    },
  ],

  "Eligibility & Selection": [
    {
      q: "How do I know if I am eligible for a scholarship?",
      a: "Each scholarship lists its eligibility criteria — such as academic performance, financial status, or category — on the scholarship details page.",
    },
    {
      q: "Can I apply if I have backlogs?",
      a: "It depends on the scholarship. Some scholarships require a clean academic record, while others allow backlogs under specific conditions.",
    },
    {
      q: "How are recipients selected?",
      a: "Selections are based on merit, eligibility criteria, and availability of funds. Some scholarships may also include interviews or verification rounds.",
    },
  ],

  "Application Status & Results": [
    {
      q: "Where can I check my application status?",
      a: "You can track your application progress on the 'My Applications' page after logging in to your account.",
    },
    {
      q: "How will I be notified if I get selected?",
      a: "Notifications and email alerts will be sent to selected candidates. You can also view updates on your dashboard.",
    },
    {
      q: "What if my application gets rejected?",
      a: "You’ll receive a notification explaining the reason for rejection. You can reapply for other eligible scholarships in the next cycle.",
    },
  ],

  "Profile & Account": [
    {
      q: "How do I update my profile information?",
      a: "Go to the 'Profile' section from the top navigation bar and click 'Edit Profile' to update your details like name, email, or contact number.",
    },
    {
      q: "Can I reset my password?",
      a: "Yes, click on 'Forgot Password' on the login page and follow the instructions to reset it via your registered email.",
    },
    {
      q: "Is my personal data secure?",
      a: "Yes, all your data is securely stored and encrypted. We comply with data protection standards to keep your information safe.",
    },
  ],

  "Support & Help": [
    {
      q: "Who should I contact for technical issues?",
      a: "You can reach out to our technical support team through the 'Contact Us' page or by emailing support@scholarshiptracker.in.",
    },
    {
      q: "Can I edit my application after submission?",
      a: "Once submitted, most scholarships do not allow editing. However, you may withdraw and reapply if the application window is still open.",
    },
    {
      q: "How can institutions or admins manage scholarships?",
      a: "Authorized admins can log in to the admin dashboard to approve, reject, or verify student applications and manage scholarship listings.",
    },
  ],
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(Object.keys(faqData)[0]);
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <div className="faq-page">
      <h1 className="faq-title">🎓 Scholarship FAQs</h1>
      <div className="faq-container">
        {/* Sidebar */}
        <div className="faq-sidebar">
          <h3 className="sidebar-heading">Categories</h3>
          {Object.keys(faqData).map((category) => (
            <div
              key={category}
              className={`sidebar-item ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => {
                setActiveCategory(category);
                setOpenQuestion(null);
              }}
            >
              {category}
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="faq-content">
          {faqData[activeCategory].map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openQuestion === index ? "open" : ""}`}
            >
              <div
                className="faq-question"
                onClick={() =>
                  setOpenQuestion(openQuestion === index ? null : index)
                }
              >
                {item.q}
                <span className="faq-toggle">
                  {openQuestion === index ? "−" : "+"}
                </span>
              </div>
              {openQuestion === index && (
                <div className="faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
