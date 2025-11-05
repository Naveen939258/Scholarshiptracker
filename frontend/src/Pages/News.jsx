import React, { useState } from "react";
import "./CSS/News.css";

const News = () => {
  const [news] = useState([
    {
      title: "KLU Students Secure 100+ Government Scholarships 🎉",
      date: "Oct 2025",
      content:
        "Over 100 KLU students have successfully received merit-based and government scholarships through our platform.",
    },
    {
      title: "New Tie-up with National Scholarship Portal (NSP)",
      date: "Sep 2025",
      content:
        "We are excited to announce our integration with NSP to simplify scholarship applications and faster verification.",
    },
    {
      title: "Success Story: Meet Ananya – From Dreams to Reality",
      date: "Aug 2025",
      content:
        "Ananya, a third-year engineering student, secured the AICTE Pragati Scholarship using the Scholarship Tracker platform.",
    },
    {
      title: "Scholarship Tracker Launches AI-Based Recommendation System 🤖",
      date: "Jul 2025",
      content:
        "Our new feature suggests the best scholarships based on your academic profile, eligibility, and interests.",
    },
    {
      title: "Collaboration with 50+ Universities Nationwide 🏫",
      date: "Jun 2025",
      content:
        "We’ve partnered with universities across India to bring verified and accessible scholarship opportunities to every student.",
    },
  ]);

  return (
    <div className="news-page">
      <section className="news-hero">
        <h1>Latest News & Announcements 🗞️</h1>
        <p>
          Stay up to date with new scholarships, student success stories, and important updates from the Scholarship Tracker team.
        </p>
      </section>

      <section className="news-list">
        {news.map((n, i) => (
          <div key={i} className="news-card">
            <h3>{n.title}</h3>
            <p className="news-date">{n.date}</p>
            <p>{n.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default News;
