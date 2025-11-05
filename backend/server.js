import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI =process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage setup for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ScholarshipDocs",
    allowed_formats: ["jpg", "png", "pdf"],
    transformation: [{ quality: "auto" }],
  },
});

const upload = multer({ storage });

// -------------------- MODELS --------------------
// User Model
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isBlocked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    profileImage: { type: String, default: "" }, 

  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

const scholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    provider: String,
    category: String,
    amount: Number,
    deadline: String,
    state: String,
    type: String,
    description: String,
    eligibility: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);
const Scholarship = mongoose.model("Scholarship", scholarshipSchema);

const applicationSchema = new mongoose.Schema(
  {
    scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Scholarship", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    email: String,
    mobile: String,
    dob: String,
    gender: String,
    institution: String,
    course: String,
    year: String,
    cgpa: Number,
    income: Number,
    fatherName: String,
    occupation: String,
    address: String,
    state: String,
    pincode: String,
    accountHolder: String,
    bankName: String,
    accountNumber: String,
    ifsc: String,
    documents: {
      idProof: String,
      incomeCert: String,
      marksheets: [String],
      bonafide: String,
    },
    status: { type: String, enum: ["Submitted", "Under Review", "Approved", "Rejected","Withdrawn"], default: "Submitted" },
  timeline: [
  {
    status: { type: String },
    message: { type: String },
    date: { type: Date, default: Date.now },
  },
],

  },
  
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);


const userNotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notificationId: { type: mongoose.Schema.Types.ObjectId, ref: "Notification", required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const UserNotification = mongoose.model("UserNotification", userNotificationSchema);


// -------------------- AUTH MIDDLEWARE --------------------
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// -------------------- AUTH ROUTES --------------------

// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password, phone, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, phone, isAdmin });
    await user.save();
    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "User already exists or invalid data" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
        isBlocked: user.isBlocked,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Create Default Admin
app.get("/create-default-admin", async (req, res) => {
  try {
    const email = "admin@example.com";
    const password = "Admin@123";

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ message: "Admin already exists", email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      username: "Super Admin",
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    res.json({ message: "Default admin created", email, password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/auth/me", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update My Profile
app.put("/auth/me", fetchUser, upload.single("profileImage"), async (req, res) => {
  try {
    const { username, email, phone, password, currentPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify current password before allowing changes
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid current password" });
    }

    // Build update data
    let updateData = { username, email, phone };

    // ✅ If new password entered, hash and save
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // ✅ If image uploaded, save its Cloudinary URL
    if (req.file && req.file.path) {
      updateData.profileImage = req.file.path;
    }

    // Update in MongoDB
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});
// -------------------- ADMIN USER MANAGEMENT --------------------

// Get All Users
app.get("/admin/users", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) return res.status(403).json({ error: "Not authorized" });

    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User (Edit modal)
app.put("/admin/users/:id", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) return res.status(403).json({ error: "Not authorized" });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Block/Unblock User
app.patch("/admin/users/:id/block", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) return res.status(403).json({ error: "Not authorized" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isBlocked = !user.isBlocked;
    user.status = user.isBlocked ? "Inactive" : "Active";
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete User
app.delete("/admin/users/:id", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) return res.status(403).json({ error: "Not authorized" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🟢 Admin — Get Scholarships with Application Count
app.get("/api/admin/scholarships", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin)
      return res.status(403).json({ error: "Not authorized" });

    const scholarships = await Scholarship.find().sort({ createdAt: -1 });

    // Add number of applications for each scholarship
    const scholarshipsWithCounts = await Promise.all(
      scholarships.map(async (s) => {
        const count = await Application.countDocuments({ scholarshipId: s._id });
        return { ...s.toObject(), applicationsCount: count };
      })
    );

    res.json(scholarshipsWithCounts);
  } catch (err) {
    console.error("❌ Error fetching admin scholarships:", err);
    res.status(500).json({ error: "Failed to fetch scholarships" });
  }
});
// ✅ For regular users
app.get("/api/scholarships", fetchUser, async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ status: "Active" })
      .sort({ createdAt: -1 });

    res.json(scholarships);
  } catch (err) {
    console.error("❌ Error fetching scholarships:", err);
    res.status(500).json({ error: "Failed to fetch scholarships" });
  }
});


app.post("/api/admin/scholarships", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) return res.status(403).json({ error: "Not authorized" });

    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    res.json({ message: "Scholarship created successfully", scholarship });
  } catch (err) {
    res.status(500).json({ error: "Failed to create scholarship" });
  }
});

app.put("/api/admin/scholarships/:id", fetchUser, async (req, res) => {
  try {
    const updated = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update scholarship" });
  }
});

app.delete("/api/admin/scholarships/:id", fetchUser, async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Scholarship deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete scholarship" });
  }
});

app.put("/api/admin/scholarships/:id/status", fetchUser, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Scholarship.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update scholarship status" });
  }
});
// -------------------- APPLICATION ROUTES --------------------

// Apply for scholarship
app.post(
  "/api/applications/apply",
  fetchUser,
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "incomeCert", maxCount: 1 },
    { name: "marksheets", maxCount: 5 },
    { name: "bonafide", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        scholarshipId,
        fullName,
        email,
        mobile,
        dob,
        gender,
        institution,
        course,
        year,
        cgpa,
        income,
        fatherName,
        occupation,
        address,
        state,
        pincode,
        accountHolder,
        bankName,
        accountNumber,
        ifsc,
      } = req.body;

      const files = req.files;
      const documents = {
        idProof: files.idProof ? files.idProof[0].path : "",
        incomeCert: files.incomeCert ? files.incomeCert[0].path : "",
        marksheets: files.marksheets ? files.marksheets.map((f) => f.path) : [],
        bonafide: files.bonafide ? files.bonafide[0].path : "",
      };

      const appExists = await Application.findOne({
        userId: req.user.id,
        scholarshipId,
      });
      if (appExists)
        return res.status(400).json({ error: "You already applied for this scholarship" });

      const application = new Application({
        scholarshipId,
        userId: req.user.id,
        fullName,
        email,
        mobile,
        dob,
        gender,
        institution,
        course,
        year,
        cgpa,
        income,
        fatherName,
        occupation,
        address,
        state,
        pincode,
        accountHolder,
        bankName,
        accountNumber,
        ifsc,
        documents,
        timeline: [
    { status: "Submitted", message: "Application submitted by you" },
  ],
      });

      await application.save();
      res.json({ message: "Application submitted successfully", application });
    } catch (err) {
      console.error("❌ Application Error:", err);
      res.status(500).json({ error: "Failed to submit application" });
    }
  }
);

// Get My Applications
app.get("/api/applications/my", fetchUser, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).populate("scholarshipId");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Admin — View All Applications
app.get("/api/admin/applications", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin) return res.status(403).json({ error: "Not authorized" });

    const apps = await Application.find()
      .populate("userId", "username email")
      .populate("scholarshipId", "name provider")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Admin — Update Application Status
// Admin — Update Application Status
// Admin — Update Application Status (Amazon-style tracker)
app.put("/api/admin/applications/:id/status", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin)
      return res.status(403).json({ error: "Not authorized" });

    const { status, message } = req.body;
    const appData = await Application.findById(req.params.id);

    if (!appData)
      return res.status(404).json({ error: "Application not found" });

    // ✅ Prevent duplicate timeline entry if the same status was already set
    const lastEntry = appData.timeline[appData.timeline.length - 1];
    if (!lastEntry || lastEntry.status !== status) {
      appData.timeline.push({
        status,
        message: message || `Application moved to "${status}" by admin`,
        date: new Date(),
      });
    }

    // ✅ Update the current status
    appData.status = status;
    await appData.save();

    res.json({
      message: `Application updated to ${status}`,
      application: appData,
    });
  } catch (err) {
    console.error("❌ Failed to update status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// =============================================
// 🟡 Withdraw My Application
// =============================================
app.put("/api/applications/:id/withdraw", fetchUser, async (req, res) => {
  try {
    const appId = req.params.id;
    const appData = await Application.findById(appId);

    if (!appData) return res.status(404).json({ error: "Application not found" });
    if (appData.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized to withdraw this application" });

    if (["Approved", "Rejected", "Withdrawn"].includes(appData.status))
      return res.status(400).json({ error: "Cannot withdraw this application anymore" });

    appData.status = "Withdrawn";
    await appData.save();

    res.json({ message: "Application withdrawn successfully", application: appData });
  } catch (err) {
    console.error("❌ Withdraw Error:", err);
    res.status(500).json({ error: "Failed to withdraw application" });
  }
});
// =============================================
// 🟢 Update My Application Details (Bank/Docs)
// =============================================
app.put(
  "/api/applications/:id/update",
  fetchUser,
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "incomeCert", maxCount: 1 },
    { name: "marksheets", maxCount: 5 },
    { name: "bonafide", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const appId = req.params.id;
      const appData = await Application.findById(appId);

      if (!appData) return res.status(404).json({ error: "Application not found" });
      if (appData.userId.toString() !== req.user.id)
        return res.status(403).json({ error: "Not authorized to update this application" });

      if (["Approved", "Rejected"].includes(appData.status))
        return res.status(400).json({ error: "Cannot update approved or rejected applications" });

      const {
        bankName,
        accountNumber,
        ifsc,
        accountHolder,
        cgpa,
        income,
      } = req.body;

      const files = req.files;
      const documents = {
        idProof: files.idProof
          ? files.idProof[0].path
          : appData.documents.idProof,
        incomeCert: files.incomeCert
          ? files.incomeCert[0].path
          : appData.documents.incomeCert,
        marksheets: files.marksheets
          ? files.marksheets.map((f) => f.path)
          : appData.documents.marksheets,
        bonafide: files.bonafide
          ? files.bonafide[0].path
          : appData.documents.bonafide,
      };

      // Update fields
      appData.bankName = bankName || appData.bankName;
      appData.accountNumber = accountNumber || appData.accountNumber;
      appData.ifsc = ifsc || appData.ifsc;
      appData.accountHolder = accountHolder || appData.accountHolder;
      appData.cgpa = cgpa || appData.cgpa;
      appData.income = income || appData.income;
      appData.documents = documents;

      await appData.save();

      res.json({
        message: "Application updated successfully",
        application: appData,
      });
    } catch (err) {
      console.error("❌ Update Application Error:", err);
      res.status(500).json({ error: "Failed to update application" });
    }
  }
);
// =============================================
app.get("/api/ai/recommendations", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userApps = await Application.find({ userId }).sort({ createdAt: -1 });
    const user = userApps[0];
    const allScholarships = await Scholarship.find({ status: "Active" });

    // ⚡ If no applications yet — show top random active scholarships
    if (!user) {
      const shuffled = allScholarships.sort(() => 0.5 - Math.random());
      const randomRecs = shuffled.slice(0, 5).map(s => ({
        _id: s._id,
        name: s.name,
        category: s.category || "General",
        amount: s.amount || "N/A",
        deadline: s.deadline || "N/A",
        match: Math.floor(Math.random() * (95 - 70 + 1)) + 70, // random 70–95%
        reason: "Top rated opportunity"
      }));
      return res.json(randomRecs);
    }

    // 🧠 If application exists — compute actual match
    const recommendations = allScholarships.map((s) => {
      let matchScore = 0;
      let matchedCriteria = [];

      if (user.cgpa >= 8 && s.category === "Merit-Based") {
        matchScore += 25;
        matchedCriteria.push("High CGPA");
      }
      if (user.income <= 300000 && s.category === "Need-Based") {
        matchScore += 25;
        matchedCriteria.push("Low family income");
      }
      if (user.gender === "Female" && s.category === "Women") {
        matchScore += 25;
        matchedCriteria.push("Gender-based eligibility");
      }
      if (s.state === user.state || s.state === "All India") {
        matchScore += 15;
        matchedCriteria.push("State eligibility match");
      }
      if (
        user.course?.toLowerCase().includes("engineering") &&
        s.name?.toLowerCase().includes("engineering")
      ) {
        matchScore += 10;
        matchedCriteria.push("Course relevance");
      }

      return {
        _id: s._id,
        name: s.name,
        category: s.category,
        amount: s.amount,
        deadline: s.deadline,
        match: matchScore,
        reason: matchedCriteria.join(", ") || "General eligibility",
      };
    });

    const filtered = recommendations.filter(r => r.match > 0);
    const sorted = filtered.sort((a, b) => b.match - a.match).slice(0, 5);
    res.json(sorted);
  } catch (err) {
    console.error("⚠️ AI recommendation error:", err.message);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

app.get("/api/admin/notifications", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin)
      return res.status(403).json({ error: "Not authorized" });

    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Create and send notification to all users
app.post("/api/admin/notifications", fetchUser, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin.isAdmin)
      return res.status(403).json({ error: "Not authorized" });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // Prevent duplicate messages within 3 seconds
    const last = await Notification.findOne().sort({ createdAt: -1 });
    if (last && Date.now() - new Date(last.createdAt).getTime() < 3000) {
      return res.status(400).json({ error: "Duplicate notification prevented" });
    }

    // Save notification
    const notification = new Notification({ message });
    await notification.save();

    // Send to all users
    const users = await User.find();
    const userNotifs = users.map((u) => ({
      userId: u._id,
      notificationId: notification._id,
    }));
    await UserNotification.insertMany(userNotifs);

    res.json({
      message: "Notification sent to all users",
      notification,
    });
  } catch (err) {
    console.error("⚠️ Notification Error:", err);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// =============================================
// 👤 USER NOTIFICATION ROUTES
// =============================================

// Get user's notifications
app.get("/api/notifications/:userId", fetchUser, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId)
      return res.status(403).json({ error: "Unauthorized" });

    const userNotifications = await UserNotification.find({ userId })
      .populate("notificationId", "message createdAt")
      .sort({ createdAt: -1 });

    const formatted = userNotifications.map((n) => ({
      id: n._id,
      message: n.notificationId.message,
      createdAt: n.notificationId.createdAt,
      isRead: n.isRead,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark all user notifications as read
// PUT /api/notifications/usernotification/:userNotifId/read
app.put("/api/notifications/usernotification/:userNotifId/read", fetchUser, async (req, res) => {
  try {
    const { userNotifId } = req.params;
    // ensure the UserNotification belongs to the logged-in user
    const userNotif = await UserNotification.findById(userNotifId);
    if (!userNotif) return res.status(404).json({ error: "Not found" });
    if (userNotif.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    // Only update if it is unread
    if (!userNotif.isRead) {
      userNotif.isRead = true;
      await userNotif.save();
    }

    res.json({ message: "Notification marked read", id: userNotifId });
  } catch (err) {
    console.error("Error marking single notification read:", err);
    res.status(500).json({ error: "Failed to update" });
  }
});
// PUT /api/notifications/:userId/read
app.put("/api/notifications/:userId/read", fetchUser, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const result = await UserNotification.updateMany(
      { userId, isRead: false },      // only unread
      { $set: { isRead: true } }
    );
    // result.modifiedCount (or result.nModified depending on driver)
    res.json({ message: "All notifications marked as read", modifiedCount: result.modifiedCount ?? result.nModified });
  } catch (err) {
    console.error("Error marking all read:", err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});


app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
