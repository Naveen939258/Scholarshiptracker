import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./CSS/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("https://scholarshiptracker.onrender.com/auth/me", {
        headers: { "auth-token": token },
      });
      setUser(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        phone: res.data.phone || "",
        password: "",
      });
      setProfileImage(res.data.profileImage || null);
    } catch (err) {
      console.error("❌ Failed to load profile", err);
      setMessage("❌ Failed to load profile");
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(file);
  };

  // Update profile (with image + password check)
  const handleUpdate = async () => {
    if (!currentPassword) {
      alert("❌ Current password is required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("currentPassword", currentPassword);

      if (formData.password && formData.password.trim() !== "") {
        data.append("password", formData.password);
      }
      if (profileImage instanceof File) {
        data.append("profileImage", profileImage);
      }

      const res = await axios.put("https://scholarshiptracker.onrender.com/auth/me", data, {
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      setEditMode(false);
      setCurrentPassword("");
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      setMessage("❌ Update failed — check current password or fields");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-avatar">
        {profileImage ? (
          <img
            src={
              typeof profileImage === "string"
                ? profileImage
                : URL.createObjectURL(profileImage)
            }
            alt="Profile"
            className="profile-image"
          />
        ) : (
          user.username?.charAt(0).toUpperCase()
        )}
      </div>

      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        {message && <p className="profile-message">{message}</p>}

        {!editMode ? (
          <>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || "-"}</p>
            <button onClick={() => setEditMode(true)} className="edit-btn">
              ✏ Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="profile-image-wrapper">
              <img
                src={
                  profileImage
                    ? typeof profileImage === "string"
                      ? profileImage
                      : URL.createObjectURL(profileImage)
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="profile-image"
              />
              <input type="file" onChange={handleFileChange} />
            </div>

            <input
              type="text"
              placeholder="Name"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Current Password (required)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password (optional)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <div className="profile-actions">
              <button
                onClick={() => {
                  setEditMode(false);
                  setCurrentPassword("");
                  setProfileImage(user.profileImage || null);
                  setFormData({
                    username: user.username,
                    email: user.email,
                    phone: user.phone || "",
                    password: "",
                  });
                  setMessage("");
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleUpdate} className="save-btn">
                Save
              </button>
            </div>

            <p className="profile-note">
              * Current password is required for all updates.<br />
              * New password is optional.<br />
              * Image uploads are handled by the backend (Cloudinary).
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
