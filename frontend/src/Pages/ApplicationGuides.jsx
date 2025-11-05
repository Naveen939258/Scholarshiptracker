import React from "react";
import "./CSS/ApplicationGuides.css";

const ApplicationGuides = () => {
  const guides = [
    {
      title: "Step-by-Step Guide to Apply for Scholarships",
      content:
        "Learn how to register, fill in details, upload documents, and track your scholarship application through our platform.",
    },
    {
      title: "How to Write an Impressive Scholarship Essay",
      content:
        "Discover tips on structuring your essay, highlighting achievements, and making your story stand out to reviewers.",
    },
    {
      title: "Common Mistakes to Avoid During Application",
      content:
        "Avoid errors like incorrect documents, missing deadlines, and incomplete forms to ensure your application is accepted.",
    },
  ];

  return (
    <div className="guides-page">
      <section className="guides-hero">
        <h1>📘 Scholarship Application Guides</h1>
        <p>
          Follow these guides to make your scholarship application process smooth and successful.
        </p>
      </section>

      <section className="guides-list">
        {guides.map((guide, index) => (
          <div key={index} className="guide-card">
            <h3>{guide.title}</h3>
            <p>{guide.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ApplicationGuides;
