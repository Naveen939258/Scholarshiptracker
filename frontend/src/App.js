import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Pages/Dashboard";
import ScholarshipsPage from "./Pages/ScholarshipsPage";
import MyApplications from "./Pages/MyApplications";
import LoginSignup from "./Pages/LoginSignUp";
import AppliedApplication from "./Pages/AppliedApplication";
import Profile from "./Pages/Profile";
import News from "./Pages/News";
import FAQ from "./Pages/FAQ";
import Contact from "./Pages/Contact";
import ApplicationGuides from "./Pages/ApplicationGuides";
import EligibilityTips from "./Pages/EligibilityTips";
import Blog from "./Pages/Blog";
import AboutUs from "./Pages/AboutUs";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";

function App() {
  return (
    <Router>
      <div>
        <Navbar/>
      <main>
    <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scholarships" element={<ScholarshipsPage/>} />
            <Route path="/applications" element={<MyApplications/>}/>
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/applied-application" element={<AppliedApplication />} />
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/news" element={<News/>}/>
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/guides" element={<ApplicationGuides/>}/>
            <Route path="/eligibility" element={<EligibilityTips/>}/>
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/about" element={<AboutUs/>}/>
            <Route path="/privacy" element={<PrivacyPolicy/>}/>
            <Route path="/terms" element={<TermsOfService />} />






    </Routes>
      </main>
      <Footer/>
      </div>
    </Router>
  );
}

export default App;
