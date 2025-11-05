import React from "react";
import "./CSS/EligibilityTips.css";

const EligibilityTips = () => {
  const tips = [
    {
      title: "Maintain a Strong Academic Record",
      content:
        "Most scholarships require good grades or a minimum GPA. Keep your academics consistent to stay eligible.",
    },
    {
      title: "Check Age and Residency Criteria",
      content:
        "Always read the eligibility criteria carefully — many scholarships are limited to specific regions or age groups.",
    },
    {
      title: "Gather Required Documents Early",
      content:
        "Documents like income certificates, transcripts, and ID proofs are crucial — collect them beforehand.",
    },
    {
      title: "Apply for Multiple Scholarships",
      content:
        "Don’t limit yourself to one — applying for several increases your chances of receiving financial aid.",
    },
  ];

  return (
    <div className="eligibility-page">
      <h1>🎓 Eligibility Tips</h1>
      <p className="eligibility-subtitle">
        Increase your chances of success by understanding what scholarship providers look for.
      </p>

      <div className="eligibility-list">
        {tips.map((tip, i) => (
          <div key={i} className="eligibility-card">
            <h3>{tip.title}</h3>
            <p>{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EligibilityTips;
