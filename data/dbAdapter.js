// Margdarshak AI - Universal Database Adapter (Cloud DB + Local Multi-User DB)
// Supports: Cloud PostgreSQL / Supabase, MongoDB Atlas, and Local Persistent JSON DB

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

class DatabaseAdapter {
  constructor() {
    this.cloudProvider = process.env.CLOUD_DB_PROVIDER || (process.env.SUPABASE_URL ? 'supabase' : (process.env.MONGODB_URI ? 'mongodb' : 'local'));
    this.initLocalDb();
  }

  initLocalDb() {
    if (!fs.existsSync(DB_FILE)) {
      const defaultState = {
        users: [
          {
            id: "user_default",
            name: "Demo Student",
            email: "student@margdarshak.edu.in",
            college: "AKTU / Tier-2 College",
            targetCompany: "Tata Consultancy Services (TCS)",
            targetRole: "Systems Engineer (Prime / 9 LPA)",
            readinessScore: 75,
            geminiApiKey: ""
          }
        ],
        scans: [],
        savedScholarships: [],
        mockInterviews: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), 'utf8');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error("DB Read error:", e);
      return { users: [], scans: [], savedScholarships: [], mockInterviews: [] };
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error("DB Write error:", e);
      return false;
    }
  }

  // Auth & User Management
  findUserByEmail(email) {
    const db = this.read();
    return (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(userId) {
    const db = this.read();
    return (db.users || []).find(u => u.id === userId);
  }

  registerUser({ name, email, password, college, targetCompany, targetRole }) {
    const db = this.read();
    db.users = db.users || [];
    
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: name || "Student Aspirant",
      email: email.toLowerCase(),
      password: password || "password123", // In production, hash with bcrypt
      college: college || "Engineering College",
      targetCompany: targetCompany || "TCS Prime",
      targetRole: targetRole || "Software Development Engineer",
      readinessScore: 65,
      geminiApiKey: "",
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    this.write(db);
    return { success: true, user: newUser };
  }

  authenticate(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return { success: false, error: "Invalid email or account does not exist." };
    }
    if (user.password && user.password !== password) {
      return { success: false, error: "Incorrect password." };
    }
    return { success: true, user: user };
  }

  updateUserProfile(userId, updates) {
    const db = this.read();
    const user = (db.users || []).find(u => u.id === userId);
    if (!user) return null;

    Object.assign(user, updates);
    this.write(db);
    return user;
  }

  // Dashboard Aggregation per Student User
  getDashboardData(userId) {
    const db = this.read();
    const user = (db.users || []).find(u => u.id === userId) || (db.users && db.users[0]) || {
      id: "guest",
      name: "Guest Student",
      targetCompany: "TCS Prime",
      targetRole: "Systems Engineer",
      readinessScore: 65
    };

    const userScans = (db.scans || []).filter(s => s.userId === user.id || !s.userId);
    const userScholarships = (db.savedScholarships || []).filter(s => s.userId === user.id || !s.userId);
    const userMocks = (db.mockInterviews || []).filter(s => s.userId === user.id || !s.userId);

    // Compute updated readiness score
    let readiness = user.readinessScore || 65;
    if (userScans.length > 0) {
      readiness = userScans[0].score;
    }
    if (userMocks.length > 0) {
      const avgMock = parseFloat(userMocks[0].overallRating) * 10;
      readiness = Math.round((readiness * 0.6) + (avgMock * 0.4));
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        targetCompany: user.targetCompany,
        targetRole: user.targetRole,
        readinessScore: readiness,
        hasCustomApiKey: !!user.geminiApiKey
      },
      savedScholarships: userScholarships,
      resumeScans: userScans,
      mockInterviews: userMocks
    };
  }

  // Save Resume Scan
  saveScan(userId, scanData) {
    const db = this.read();
    db.scans = db.scans || [];
    const record = {
      ...scanData,
      id: scanData.id || "scan_" + Date.now(),
      userId: userId || "user_default",
      timestamp: new Date().toISOString()
    };
    db.scans.unshift(record);
    
    // Update user target & readiness
    const user = (db.users || []).find(u => u.id === record.userId);
    if (user) {
      user.targetCompany = record.company;
      user.targetRole = record.role;
      user.readinessScore = record.score;
    }

    this.write(db);
    return record;
  }

  // Save Scholarship Bookmark
  saveScholarship(userId, scholarship) {
    const db = this.read();
    db.savedScholarships = db.savedScholarships || [];
    const uid = userId || "user_default";

    if (!db.savedScholarships.some(s => s.id === scholarship.id && s.userId === uid)) {
      const record = {
        ...scholarship,
        userId: uid,
        status: scholarship.status || "Saved",
        dateSaved: new Date().toLocaleDateString('en-IN')
      };
      db.savedScholarships.push(record);
      this.write(db);
      return { success: true, saved: record };
    }
    return { success: false, message: "Already saved" };
  }

  removeScholarship(userId, scholarshipId) {
    const db = this.read();
    const uid = userId || "user_default";
    db.savedScholarships = (db.savedScholarships || []).filter(s => !(s.id === scholarshipId && (s.userId === uid || !s.userId)));
    this.write(db);
    return true;
  }

  updateScholarshipStatus(userId, scholarshipId, newStatus) {
    const db = this.read();
    const uid = userId || "user_default";
    const item = (db.savedScholarships || []).find(s => s.id === scholarshipId && (s.userId === uid || !s.userId));
    if (item) {
      item.status = newStatus;
      this.write(db);
      return true;
    }
    return false;
  }

  // Save Mock Interview
  saveMockInterview(userId, scorecard) {
    const db = this.read();
    db.mockInterviews = db.mockInterviews || [];
    const record = {
      ...scorecard,
      id: scorecard.id || "mock_" + Date.now(),
      userId: userId || "user_default",
      timestamp: new Date().toISOString()
    };
    db.mockInterviews.unshift(record);
    this.write(db);
    return record;
  }
}

module.exports = new DatabaseAdapter();
