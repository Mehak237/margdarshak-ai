// Margdarshak AI - Full-Stack Node.js REST API Backend & Cloud Database Engine
// Created by Mehak | SIH 2024 Edition
// Zero external dependencies (uses native http, https, fs, path, url)

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load Data & Services
const { companiesData, getAllRolesList } = require('./data/companies.js');
const { scholarshipsData } = require('./data/scholarships.js');
const { interviewQuestionBank, generateInterviewQuestions } = require('./data/interviewQuestions.js');
const dbAdapter = require('./data/dbAdapter.js');
const geminiService = require('./data/geminiService.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

// JSON body parser helper
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// JSON response helper
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id, x-gemini-key'
  });
  res.end(JSON.stringify(data));
}

// REST API Router
async function handleApi(req, res, parsedUrl) {
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;
  const currentUserId = req.headers['x-user-id'] || query.userId || 'usr_demo';
  const customApiKey = req.headers['x-gemini-key'] || '';

  // 1. Health & Server Info
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'ok',
      application: 'Margdarshak AI',
      tagline: 'From Classroom to Dream Career — Guided by AI',
      creator: 'Mehak',
      edition: 'SIH 2024 Edition',
      features: ['Resume Gap Analyzer', 'Scholarship Engine & SOP', 'AI Mock Interviewer', '9 Indian Languages', 'PWA Offline', 'Multi-User Cloud DB', 'Gemini AI'],
      uptime: process.uptime()
    });
  }

  // 2. Authentication: POST /api/auth/register
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = await parseBody(req);
    if (!body.email || !body.name) {
      return sendJson(res, 400, { success: false, error: "Name and Email are required" });
    }
    const result = dbAdapter.registerUser(body);
    return sendJson(res, result.success ? 200 : 400, result);
  }

  // 3. Authentication: POST /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    if (!body.email) {
      return sendJson(res, 400, { success: false, error: "Email is required" });
    }
    const result = dbAdapter.authenticate(body.email, body.password);
    return sendJson(res, result.success ? 200 : 401, result);
  }

  // 4. User Profile: GET /api/auth/me
  if (pathname === '/api/auth/me' && method === 'GET') {
    const user = dbAdapter.findUserById(currentUserId) || dbAdapter.read().users[0];
    return sendJson(res, 200, { user: user });
  }

  // 5. Settings: POST /api/settings/api-key
  if (pathname === '/api/settings/api-key' && method === 'POST') {
    const body = await parseBody(req);
    const key = (body.apiKey || '').trim();
    dbAdapter.updateUserProfile(currentUserId, { geminiApiKey: key });
    return sendJson(res, 200, { success: true, message: "Gemini API key updated successfully" });
  }

  // 6. GET /api/companies
  if (pathname === '/api/companies' && method === 'GET') {
    const q = (query.q || '').toLowerCase().trim();
    const allRoles = getAllRolesList();
    if (!q) {
      return sendJson(res, 200, { total: allRoles.length, roles: allRoles });
    }
    const filtered = allRoles.filter(r => 
      r.companyName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.requiredSkills.some(s => s.toLowerCase().includes(q))
    );
    return sendJson(res, 200, { total: filtered.length, roles: filtered });
  }

  // 7. GET /api/scholarships
  if (pathname === '/api/scholarships' && method === 'GET') {
    const income = query.income && query.income !== 'all' ? parseInt(query.income, 10) : null;
    const marks = query.marks ? parseInt(query.marks, 10) : 60;
    const category = query.category && query.category !== 'all' ? query.category : null;
    const gender = query.gender && query.gender !== 'all' ? query.gender : null;
    const state = query.state && query.state !== 'all' ? query.state : null;

    const results = scholarshipsData.map(sch => {
      let eligible = true;
      let reasons = [];

      if (income !== null && income > sch.maxIncome) {
        eligible = false;
        reasons.push(`Income exceeds max limit of ₹${(sch.maxIncome / 100000).toFixed(1)}L`);
      }
      if (marks < sch.minPercentage) {
        eligible = false;
        reasons.push(`Requires minimum ${sch.minPercentage}% marks (provided: ${marks}%)`);
      }
      if (category && !sch.category.includes(category)) {
        eligible = false;
        reasons.push(`Only for ${sch.category.join(', ')} categories`);
      }
      if (gender && sch.gender !== 'Any' && sch.gender !== gender) {
        eligible = false;
        reasons.push(`Reserved for ${sch.gender}`);
      }
      if (state && !sch.states.includes('All') && !sch.states.includes(state)) {
        eligible = false;
        reasons.push(`Specific to residents of ${sch.states.join(', ')}`);
      }

      return {
        ...sch,
        isEligible: eligible,
        reasons: reasons
      };
    });

    return sendJson(res, 200, {
      total: results.length,
      eligibleCount: results.filter(r => r.isEligible).length,
      scholarships: results
    });
  }

  // 8. POST /api/analyze-gap (Resume vs Dream Job)
  if (pathname === '/api/analyze-gap' && method === 'POST') {
    const body = await parseBody(req);
    const resumeText = (body.resumeText || '').trim();
    let target = body.targetRole;

    if (!resumeText) {
      return sendJson(res, 400, { error: "Missing resumeText parameter" });
    }

    if (!target) {
      const allRoles = getAllRolesList();
      target = allRoles[0];
    }

    // Skill aliases dictionary
    const skillAliases = {
      "Data Structures & Algorithms": ["dsa", "data structures", "algorithms", "trees", "graphs", "dynamic programming", "leetcode"],
      "Java": ["java", "spring", "springboot", "spring boot", "jvm"],
      "Python": ["python", "django", "flask", "fastapi", "pandas", "numpy"],
      "C/C++": ["c++", "cpp", "c programming", "stl"],
      "JavaScript (ES6+)": ["javascript", "js", "es6", "vanilla js", "typescript", "ts"],
      "React.js": ["react", "react.js", "reactjs", "redux", "next.js", "nextjs"],
      "SQL & DBMS": ["sql", "mysql", "postgresql", "dbms", "database", "rdbms"],
      "System Design": ["system design", "distributed systems", "scalability", "lld", "hld"],
      "System Design Basics": ["system design", "architecture", "microservices", "caching"],
      "Git": ["git", "github", "gitlab", "version control"],
      "Cloud (AWS/Azure)": ["aws", "azure", "gcp", "cloud", "s3", "ec2"],
      "Docker": ["docker", "container", "containers", "kubernetes"],
      "Microservices": ["microservices", "microservice", "rest api", "apis", "kafka"],
      "Node.js & Express": ["node", "nodejs", "node.js", "express"],
      "Clean Code": ["clean code", "refactoring", "unit tests", "modular"]
    };

    const textLower = resumeText.toLowerCase();
    const matched = [];
    const missing = [];
    const matchedBonus = [];
    const missingBonus = [];

    (target.requiredSkills || []).forEach(skill => {
      const aliases = skillAliases[skill] || [skill.toLowerCase()];
      const isFound = aliases.some(a => textLower.includes(a.toLowerCase()));
      if (isFound) matched.push(skill);
      else missing.push(skill);
    });

    (target.bonusSkills || []).forEach(skill => {
      const aliases = skillAliases[skill] || [skill.toLowerCase()];
      const isFound = aliases.some(a => textLower.includes(a.toLowerCase()));
      if (isFound) matchedBonus.push(skill);
      else missingBonus.push(skill);
    });

    const totalReq = target.requiredSkills ? target.requiredSkills.length : 5;
    const reqScore = totalReq > 0 ? (matched.length / totalReq) * 80 : 50;
    const bonusScore = target.bonusSkills && target.bonusSkills.length > 0 ? (matchedBonus.length / target.bonusSkills.length) * 20 : 15;
    let score = Math.round(reqScore + bonusScore);
    if (score > 98) score = 98;
    if (score < 32) score = 35;

    const focus1 = missing[0] || "Advanced Data Structures & Algorithms";
    const focus2 = missing[1] || "Distributed Systems & Caching";

    const roadmap = {
      phase1: {
        title: "Phase 1: Days 1–5 • Foundational Gaps",
        goal: `Master theory and implementation of ${focus1}.`,
        tasks: [
          `Days 1-2: Theory & LeetCode medium problem patterns for ${focus1}.`,
          `Days 3-4: Implement clean, modular code without blackbox libraries.`,
          `Day 5: Review time and space complexity proofs.`
        ]
      },
      phase2: {
        title: "Phase 2: Days 6–10 • Capstone Real-world Project",
        goal: `Build production-grade application showcasing ${focus2}.`,
        tasks: [
          `Days 6-7: Schema design, REST contracts, and Docker setup.`,
          `Days 8-9: Business logic with caching layer (Redis) and connection pooling.`,
          `Day 10: Deploy with live demo and GitHub README.`
        ]
      },
      phase3: {
        title: "Phase 3: Days 11–15 • Placement Polishing & STAR Stories",
        goal: `Polish resume bullets with metric-backed impact and conduct mock interviews.`,
        tasks: [
          `Days 11-12: Rewrite resume bullets using STAR format.`,
          `Days 13-14: Run simulated AI mock interviews on Margdarshak AI.`,
          `Day 15: Final elevator pitch refinement.`
        ]
      }
    };

    const result = {
      id: "scan_" + Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      company: target.companyName || "Top Tech",
      role: target.title || "Software Engineer",
      package: target.package || "Competitive",
      score: score,
      matchedSkills: matched,
      missingSkills: missing,
      matchedBonus: matchedBonus,
      missingBonus: missingBonus,
      roadmap: roadmap
    };

    // Save to multi-user database
    const savedRecord = dbAdapter.saveScan(currentUserId, result);

    return sendJson(res, 200, { success: true, analysis: savedRecord });
  }

  // 9. POST /api/evaluate-pitch
  if (pathname === '/api/evaluate-pitch' && method === 'POST') {
    const body = await parseBody(req);
    const pitchText = (body.pitchText || '').trim();
    const company = body.company || "Top Tech Company";
    const role = body.role || "Software Engineer";

    if (!pitchText) {
      return sendJson(res, 400, { error: "Missing pitchText" });
    }

    // If custom API key or default Gemini key exists, try calling live Gemini AI
    const prompt = `You are a Senior Technical Hiring Director interviewing an engineering student for a ${role} role at ${company} in India. Evaluate this elevator pitch: "${pitchText}". Provide a concise evaluation in JSON with keys: score (number out of 10), strengths (array of strings), missingPoints (array of strings), and goldenScript (an optimized 60-second polished pitch).`;
    
    let geminiRes = await geminiService.generateContent(prompt, customApiKey);
    if (geminiRes && geminiRes.success && geminiRes.text) {
      try {
        const cleaned = geminiRes.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return sendJson(res, 200, parsed);
      } catch (e) {
        // fallback to rule-based engine below
      }
    }

    // Built-in rule-based evaluation fallback
    const words = pitchText.split(/\s+/).filter(Boolean).length;
    const hasNumbers = /\d+/.test(pitchText);
    const hasProjects = /project|built|developed|created|architected/i.test(pitchText);
    const hasRole = /engineer|developer|analyst|software/i.test(pitchText);

    let score = 5.0;
    const strengths = [];
    const missing = [];

    if (words >= 40 && words <= 130) {
      score += 1.5;
      strengths.push("Ideal spoken duration (45-75 seconds).");
    } else if (words < 40) {
      missing.push("Pitch is too brief. Elaborate on technical projects and quantifiable impact.");
    } else {
      missing.push("Pitch is slightly rambling. Focus on crisp STAR milestones.");
    }

    if (hasNumbers) {
      score += 1.5;
      strengths.push("Quantified impact metrics included.");
    } else {
      missing.push("Missing numbers/metrics (e.g. 'solved 250+ problems', 'cut latency by 40%').");
    }

    if (hasProjects) {
      score += 1.0;
      strengths.push("Direct reference to hands-on software development projects.");
    } else {
      missing.push("No explicit reference to a key engineering challenge or project.");
    }

    if (hasRole) {
      score += 1.0;
      strengths.push("Good professional alignment with target role.");
    }

    if (score > 9.5) score = 9.5;

    const goldenScript = `Hello! I am a final-year engineering student focused on scalable systems and clean architecture. Over the past two years, I have built practical applications using modern stacks, including an optimized backend project where I reduced database read latency by 45%. I have solved over 250 algorithmic problems emphasizing clean code and low latency. Having followed ${company}'s work in large-scale platforms, I am eager to bring my problem-solving drive and fast learning agility to the ${role} team.`;

    return sendJson(res, 200, {
      score: score.toFixed(1),
      wordCount: words,
      strengths: strengths,
      missingPoints: missing,
      goldenScript: goldenScript
    });
  }

  // 10. POST /api/generate-sop
  if (pathname === '/api/generate-sop' && method === 'POST') {
    const body = await parseBody(req);
    const schId = body.scholarshipId;
    const sch = scholarshipsData.find(s => s.id === schId) || scholarshipsData[0];
    const bg = body.background || "First-generation engineering aspirant from a modest family.";
    const ach = body.achievements || "Scored distinction in academics; built an IoT telemetry project.";
    const vision = body.vision || "Aspire to become a software architect and mentor underprivileged rural students.";

    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    let sop = `STATEMENT OF PURPOSE & MOTIVATION LETTER\n`;
    sop += `Target Scheme: ${sch.name}\n`;
    sop += `Awarding Body: ${sch.provider}\n`;
    sop += `Date: ${dateStr}\n\n`;
    sop += `To,\nThe Selection & Grant Committee,\n${sch.provider},\nIndia.\n\n`;
    sop += `Subject: Application for ${sch.name} — Statement of Purpose\n\n`;
    sop += `Respected Members of the Committee,\n\n`;
    sop += `I am writing to respectfully submit my candidature for the esteemed ${sch.name}. As a dedicated undergraduate student pursuing higher technical education in India, receiving this grant would provide the indispensable financial and institutional foundation required to achieve my educational and societal objectives without the compounding burden of economic distress.\n\n`;
    sop += `1. Family Background & Financial Imperative:\n${bg} Economic constraints have frequently presented systemic barriers in my academic journey; however, these circumstances have also instilled within me an unwavering work ethic, resilience, and appreciation for higher education.\n\n`;
    sop += `2. Academic Trajectory & Technical Initiatives:\n${ach} Throughout my schooling and collegiate tenure, I have maintained high academic standards while continually seeking opportunities to translate theoretical engineering paradigms into community solutions.\n\n`;
    sop += `3. Career Vision & Commitment to Community Give-Back:\n${vision} Looking forward, I am determined to establish myself as a responsible technologist contributing to India's burgeoning digital infrastructure.\n\n`;
    sop += `I affirm that all details submitted in this dossier are true to the best of my knowledge. I humbly request the committee to favorably consider my application.\n\n`;
    sop += `Yours sincerely,\nCandidate Name\nContact: +91-XXXXXXXXXX | Email: applicant@margdarshak.edu.in`;

    return sendJson(res, 200, { success: true, sopText: sop, targetScholarship: sch.name });
  }

  // 11. POST /api/mock-interview/session
  if (pathname === '/api/mock-interview/session' && method === 'POST') {
    const body = await parseBody(req);
    const roleId = body.roleId || 'tcs-prime';
    const compName = body.companyName || 'TCS';
    const roleTitle = body.roleTitle || 'Systems Engineer';
    const questions = generateInterviewQuestions(roleId, compName, roleTitle);
    return sendJson(res, 200, { success: true, questions: questions });
  }

  // 12. POST /api/mock-interview/evaluate
  if (pathname === '/api/mock-interview/evaluate' && method === 'POST') {
    const body = await parseBody(req);
    const answers = body.userAnswers || [];
    const comp = body.companyName || 'Top Tech';
    const role = body.roleTitle || 'Software Engineer';

    let totalTech = 0;
    let totalArt = 0;
    const evals = answers.map((a, i) => {
      const words = (a.userAnswer || '').split(/\s+/).filter(Boolean).length;
      let qTech = 6.0;
      let qArt = 6.0;
      if (words >= 35 && words <= 150) qArt += 2.5;
      else if (words < 35) qArt -= 2.0;

      const kws = a.keywords || [];
      const matchCount = kws.filter(k => (a.userAnswer || '').toLowerCase().includes(k.toLowerCase())).length;
      if (matchCount >= 2) qTech += 2.5;
      else if (matchCount === 0) qTech -= 1.5;

      if (qTech > 10) qTech = 10;
      if (qArt > 10) qArt = 10;
      totalTech += qTech;
      totalArt += qArt;

      return {
        qIndex: i + 1,
        question: a.question,
        category: a.category,
        userAnswer: a.userAnswer,
        techScore: qTech.toFixed(1),
        artScore: qArt.toFixed(1),
        idealAnswer: a.idealAnswer,
        mistakesToAvoid: a.mistakesToAvoid
      };
    });

    const count = answers.length || 1;
    const avgTech = (totalTech / count).toFixed(1);
    const avgArt = (totalArt / count).toFixed(1);
    const overall = ((parseFloat(avgTech) * 0.6) + (parseFloat(avgArt) * 0.4)).toFixed(1);

    let verdict = overall >= 7.5 ? "Strong Hire — Recommended for Offer" : "Conditional Hire — Needs Targeted Prep";

    const scorecard = {
      id: "mock_" + Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      company: comp,
      role: role,
      overallRating: overall,
      avgTech: avgTech,
      avgArt: avgArt,
      verdict: verdict,
      questions: evals
    };

    dbAdapter.saveMockInterview(currentUserId, scorecard);

    return sendJson(res, 200, { success: true, scorecard: scorecard });
  }

  // 13. GET /api/dashboard (Student Dashboard)
  if (pathname === '/api/dashboard' && method === 'GET') {
    const data = dbAdapter.getDashboardData(currentUserId);
    return sendJson(res, 200, data);
  }

  // 14. POST /api/dashboard/scan (Save Resume Gap Scan to Cloud DB)
  if (pathname === '/api/dashboard/scan' && method === 'POST') {
    const body = await parseBody(req);
    const result = dbAdapter.saveScan(currentUserId, body);
    return sendJson(res, 200, { success: true, scan: result });
  }

  // 15. POST /api/dashboard/interview (Save Mock Interview to Cloud DB)
  if (pathname === '/api/dashboard/interview' && method === 'POST') {
    const body = await parseBody(req);
    const result = dbAdapter.saveMockInterview(currentUserId, body);
    return sendJson(res, 200, { success: true, interview: result });
  }

  // 16. POST /api/scholarships/save or /api/dashboard/save-scholarship
  if ((pathname === '/api/scholarships/save' || pathname === '/api/dashboard/save-scholarship') && method === 'POST') {
    const body = await parseBody(req);
    const sch = scholarshipsData.find(s => s.id === body.scholarshipId) || {
      id: body.scholarshipId,
      name: body.title || "Target Scholarship",
      provider: body.provider || "Government / CSR",
      awardAmount: body.amount || "₹50,000 / year"
    };
    const result = dbAdapter.saveScholarship(currentUserId, sch);
    return sendJson(res, 200, { success: true, result });
  }

  // 17. DELETE /api/dashboard/saved-scholarship
  if (pathname.startsWith('/api/dashboard/saved-scholarship') && method === 'DELETE') {
    const parts = pathname.split('/');
    const schId = parts[parts.length - 1];
    dbAdapter.removeScholarship(currentUserId, schId);
    return sendJson(res, 200, { success: true });
  }

  return sendJson(res, 404, { error: `API route ${pathname} not found` });
}

// Main HTTP Request Handler & Server
const requestListener = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id, x-gemini-key'
    });
    return res.end();
  }

  // Route /api/*
  if (parsedUrl.pathname.startsWith('/api/')) {
    return handleApi(req, res, parsedUrl);
  }

  // Static File Serving
  let reqPath = parsedUrl.pathname;
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(fallbackPath, (fbErr, content) => {
        if (fbErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Cache control for PWA assets
    const headers = { 'Content-Type': contentType };
    if (ext === '.js' || ext === '.css' || ext === '.svg') {
      headers['Cache-Control'] = 'public, max-age=3600';
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, headers);
        res.end(content);
      }
    });
  });
};

const server = http.createServer(requestListener);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Margdarshak AI Full-Stack Server is LIVE!`);
    console.log(`Created by Mehak | SIH 2024 Edition`);
    console.log(`Web App: http://localhost:${PORT}`);
    console.log(`API Health: http://localhost:${PORT}/api/health`);
    console.log(`PWA Manifest: http://localhost:${PORT}/manifest.json`);
    console.log(`Service Worker: http://localhost:${PORT}/sw.js`);
    console.log(`====================================================`);
  });
}

// Export callable function for Vercel Serverless / Node Runtime
module.exports = requestListener;
module.exports.handleApi = handleApi;
module.exports.server = server;
