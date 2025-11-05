import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../CSS/Users.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaToggleOn,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const API_BASE = "https://scholarshiptracker.onrender.com";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editUser, setEditUser] = useState(null);
  const [newUserModal, setNewUserModal] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`, {
        headers: { "auth-token": token },
      });
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ Search + Status Filter
  useEffect(() => {
    let result = users.filter(
      (u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter === "Active") {
      result = result.filter((u) => !u.isBlocked);
    } else if (statusFilter === "Inactive") {
      result = result.filter((u) => u.isBlocked);
    } else if (statusFilter === "Admins") {
      result = result.filter((u) => u.isAdmin);
    }

    setFiltered(result);
  }, [search, users, statusFilter]);

  // ✅ Sort by Name
  const handleSort = () => {
    const sorted = [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    );
    setFiltered(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // ✅ Block / Unblock
  const handleBlock = async (id) => {
    try {
      await axios.patch(`${API_BASE}/admin/users/${id}/block`, {}, {
        headers: { "auth-token": token },
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Block/Unblock failed:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/users/${id}`, {
        headers: { "auth-token": token },
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // ✅ Update
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE}/admin/users/${editUser._id}`, editUser, {
        headers: { "auth-token": token },
      });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  // ✅ Create
  const handleCreate = async () => {
    try {
      await axios.post(`${API_BASE}/auth/register`, editUser, {
        headers: { "auth-token": token },
      });
      setNewUserModal(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Create failed:", err);
    }
  };

  // ✅ Stats
  const totalUsers = users.filter((u) => !u.isAdmin).length;
  const activeUsers = users.filter((u) => !u.isBlocked && !u.isAdmin).length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const admins = users.filter((u) => u.isAdmin).length;

  return (
    <div className="users-page">
      {/* Summary */}
      <div className="summary-cards">
        <div className="card">Total Users <span>{totalUsers}</span></div>
        <div className="card">Active <span>{activeUsers}</span></div>
        <div className="card">Blocked <span>{blockedUsers}</span></div>
        <div className="card">Admins <span>{admins}</span></div>
      </div>

      {/* Search + Sort */}
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSort}>
          Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="status-filter-buttons">
        {["All", "Active", "Inactive"].map((status) => (
          <button
            key={status}
            className={statusFilter === status ? "active" : ""}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Directory Header */}
      <div className="directory-header">
        <h3>Scholarship Users</h3>
        <div>
          <button
            onClick={() => {
              setEditUser({
                username: "",
                email: "",
                phone: "",
                password: "",
              });
              setNewUserModal(true);
            }}
          >
            ➕ Add User
          </button>
          <button onClick={fetchUsers}>🔄 Refresh</button>
        </div>

        <div className="export-buttons">
          <button
            onClick={() => exportToExcel(filtered, "scholarship_users.xlsx")}
          >
            <FaFileExcel /> Export Excel
          </button>
          <button
            onClick={() =>
              exportToPDF(
                filtered,
                ["username", "email", "phone", "status"],
                "scholarship_users.pdf"
              )
            }
          >
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="user-table-container">
        {filtered.length > 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th><FaUser /> Name</th>
                <th><FaEnvelope /> Email</th>
                <th><FaToggleOn /> Status</th>
                <th><FaPhone /> Phone</th>
                <th>⚙ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered
          .filter((u) => !u.isAdmin) // ✅ Hides admin users from table
          .map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td className={u.isBlocked ? "inactive" : "active"}>
                    {u.isBlocked
                      ? "Inactive"
                      : u.isAdmin
                      ? "Admin"
                      : "Active"}
                  </td>
                  <td>{u.phone || "-"}</td>
                  <td>
                    <button onClick={() => setEditUser(u)}>✏ Edit</button>
                    {!u.isAdmin && (
                      <>
                        <button onClick={() => handleBlock(u._id)}>
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button onClick={() => handleDelete(u._id)}>🗑 Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-users">No users found</p>
        )}
      </div>

      {/* Modal */}
      {editUser && (
        <div className="modal1">
          <div className="modal-content">
            <h3>{newUserModal ? "Add User" : "Edit User"}</h3>
            <input
              type="text"
              placeholder="Name"
              value={editUser.username}
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              value={editUser.phone || ""}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
            />
            {newUserModal && (
              <input
                type="password"
                placeholder="Password"
                value={editUser.password || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
              />
            )}
            <div className="modal-actions">
              <button
                onClick={() => {
                  setEditUser(null);
                  setNewUserModal(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={newUserModal ? handleCreate : handleUpdate}
                className="save-btn"
              >
                {newUserModal ? "Add User" : "Update User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
