import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Navbar.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userInitial, setUserInitial] = useState("");
  const [userImage, setUserImage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!token || !userData?.id) return;

    try {
      const res = await axios.get(`${API_BASE}/api/notifications/${userData.id}`, {
        headers: { "auth-token": token },
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ Fetch latest user info
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { "auth-token": token },
      });

      const userData = res.data;
      localStorage.setItem("user", JSON.stringify(userData));

      setIsLoggedIn(true);
      setUserInitial(userData.username?.charAt(0).toUpperCase() || "?");
      setUserImage(userData.profileImage || "");
    } catch (err) {
      console.error("❌ Failed to fetch user profile for navbar:", err);
      setIsLoggedIn(false);
    }
  };

  // ✅ On mount or login change
  useEffect(() => {
    const handleLoginStatusChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      fetchUserProfile();
    };

    handleLoginStatusChange();
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    if (isLoggedIn) {
      fetchUserProfile();
      fetchNotifications();
    }

    return () => {
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, [isLoggedIn]);

  // ✅ Mark single notification as read
  const handleMarkSingleRead = async (notifId) => {
    const token = localStorage.getItem("token");
    if (!token || !notifId) return;

    try {
      await axios.put(
        `${API_BASE}/api/notifications/usernotification/${notifId}/read`,
        {},
        { headers: { "auth-token": token } }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notifId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // ✅ Mark all notifications as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!token || !userData?.id) return;

    try {
      await axios.put(
        `${API_BASE}/api/notifications/${userData.id}/read`,
        {},
        { headers: { "auth-token": token } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // ✅ Fetch notifications when logged in or refreshed
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (token && userData?.id) {
      fetchNotifications();
    }
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserInitial("");
    setUserImage("");
    navigate("/");
  };

  return (
    <nav>
      <h1>🎓 Scholarship Tracker</h1>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/scholarships">Scholarships</Link></li>
        {isLoggedIn && <li><Link to="/applications">Applications</Link></li>}
      </ul>

      {isLoggedIn ? (
        <div className="nav-right">
          {/* 🔔 Notifications */}
          <div className="notification-wrapper">
            <FontAwesomeIcon
              icon={faBell}
              className="bell-icon"
              onClick={async () => {
                if (!showDropdown) await fetchNotifications();
                setShowDropdown(!showDropdown);
              }}
            />

            {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}

            {showDropdown && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <strong>Notifications</strong>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="mark-all-btn">
                      Mark All Read
                    </button>
                  )}
                </div>

                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.isRead ? "read" : ""}`}
                      onClick={() => handleMarkSingleRead(n.id)}
                    >
                      <p>{n.message}</p>
                      <small>{new Date(n.createdAt).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p className="no-notif">No notifications</p>
                )}
              </div>
            )}
          </div>

          {/* ✅ Profile Avatar */}
          <Link to="/profile" className="profile-avatar1" title="My Profile">
            {userImage ? (
              <img
                src={userImage}
                alt="User Avatar"
                className="user-avatar-img"
              />
            ) : (
              <span>{userInitial || "?"}</span>
            )}
          </Link>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <ul className="nav-auth">
          <li><Link to="/login">Login / Signup</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
