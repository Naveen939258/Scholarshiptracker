import React from "react";
import "./CSS/Blog.css";

const Blog = () => {
  const posts = [
    {
      title: "Top 10 Government Scholarships for Indian Students (2025)",
      date: "October 2025",
      content:
        "Explore the best government scholarships available this year, eligibility details, and how to apply online easily.",
    },
    {
      title: "How to Write a Strong Scholarship Motivation Letter",
      date: "September 2025",
      content:
        "Learn key strategies for crafting a motivation letter that reflects your goals, achievements, and passion.",
    },
    {
      title: "Scholarship Interview Preparation: What to Expect",
      date: "August 2025",
      content:
        "Prepare confidently for scholarship interviews with tips, sample questions, and expert advice.",
    },
  ];

  return (
    <div className="blog-page">
      <h1>📰 Scholarship Blog</h1>
      <p className="blog-subtitle">
        Read articles, tips, and stories to help you achieve your educational dreams.
      </p>

      <div className="blog-list">
        {posts.map((post, index) => (
          <div key={index} className="blog-card">
            <h3>{post.title}</h3>
            <p className="blog-date">{post.date}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
