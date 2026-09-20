// Margdarshak AI - Killer Feature #1: "Resume vs Dream Job" Gap Analyzer
// Comprehensive search across 65+ companies, skill extraction, SVG match score circle,
// 15-day personalized action roadmap, and "Tell Me About Yourself" pitch evaluator.

class GapAnalyzer {
  constructor() {
    this.selectedRole = null;
    this.allRoles = [];
    this.currentAnalysis = null;
    this.init();
  }

  init() {
    if (window.getAllRolesList) {
      this.allRoles = window.getAllRolesList();
    }
    this.bindEvents();
    // Default to TCS Prime or Amazon SDE-1
    if (this.allRoles.length > 0) {
      this.selectRole(this.allRoles[0]);
      const searchInput = document.getElementById('companySearchInput');
      if (searchInput) {
        searchInput.value = `${this.allRoles[0].companyName} — ${this.allRoles[0].title}`;
      }
    }
  }

  bindEvents() {
    const searchInput = document.getElementById('companySearchInput');
    const searchDropdown = document.getElementById('companySearchDropdown');
    const customToggleBtn = document.getElementById('customRoleToggleBtn');
    const customRoleBox = document.getElementById('customRoleBox');
    const analyzeBtn = document.getElementById('runGapAnalysisBtn');
    const resumeTextInput = document.getElementById('resumeTextInput');
    const dropZone = document.getElementById('resumeDropZone');
    const fileInput = document.getElementById('resumeFileInput');
    const evaluatePitchBtn = document.getElementById('evaluatePitchBtn');
    const clearBtn = document.getElementById('clearResumeTextBtn');

    // Search bar autocomplete
    if (searchInput && searchDropdown) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        this.renderSearchResults(query, searchDropdown);
      });

      searchInput.addEventListener('focus', () => {
        this.renderSearchResults(searchInput.value.trim().toLowerCase(), searchDropdown);
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.add('hidden');
        }
      });
    }

    // Toggle custom role box
    if (customToggleBtn && customRoleBox) {
      customToggleBtn.addEventListener('click', () => {
        customRoleBox.classList.toggle('hidden');
      });
    }

    // File Drag & Drop
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', (e) => {
        if (e.target !== fileInput) {
          fileInput.click();
        }
      });

      fileInput.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-950/20');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-950/20');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-950/20');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFileUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFileUpload(e.target.files[0]);
        }
      });
    }

    // Clear resume text button
    if (clearBtn && resumeTextInput) {
      clearBtn.addEventListener('click', () => {
        resumeTextInput.value = '';
        const statusText = document.getElementById('uploadStatusText');
        if (statusText) statusText.innerHTML = '';
        const errorBanner = document.getElementById('resumeInputError');
        if (errorBanner) errorBanner.classList.add('hidden');
        resumeTextInput.classList.remove('border-rose-500');
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    }

    // Resume input listener to clear error
    if (resumeTextInput) {
      resumeTextInput.addEventListener('input', () => {
        const errorBanner = document.getElementById('resumeInputError');
        if (errorBanner) errorBanner.classList.add('hidden');
        resumeTextInput.classList.remove('border-rose-500');
      });
    }

    // Sample Resumes
    const sample1 = document.getElementById('sampleResume1');
    const sample2 = document.getElementById('sampleResume2');
    const sample3 = document.getElementById('sampleResume3');

    if (sample1) sample1.addEventListener('click', () => this.loadSampleResume(1));
    if (sample2) sample2.addEventListener('click', () => this.loadSampleResume(2));
    if (sample3) sample3.addEventListener('click', () => this.loadSampleResume(3));

    // Run Analysis
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.runAnalysis();
      });
    }

    // Evaluate Pitch
    if (evaluatePitchBtn) {
      evaluatePitchBtn.addEventListener('click', () => {
        this.evaluatePitch();
      });
    }
  }

  renderSearchResults(query, dropdown) {
    let filtered = this.allRoles;
    if (query) {
      filtered = this.allRoles.filter(r => 
        r.companyName.toLowerCase().includes(query) ||
        r.title.toLowerCase().includes(query) ||
        r.requiredSkills.some(s => s.toLowerCase().includes(query)) ||
        r.category.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      dropdown.innerHTML = `
        <div class="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">
          No company/role matched "${query}". You can use the "Enter Custom Role" option below!
        </div>
      `;
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = filtered.slice(0, 15).map(item => `
      <div class="role-search-item px-4 py-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-800 transition border-b border-slate-100 dark:border-slate-800 last:border-0" data-role-id="${item.roleId}">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-slate-900 dark:text-white text-sm">${item.companyName}</span>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">${item.package}</span>
        </div>
        <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">${item.title} • <span class="text-slate-400 dark:text-slate-500">${item.category}</span></div>
        <div class="flex flex-wrap gap-1 mt-1.5">
          ${item.requiredSkills.slice(0, 4).map(s => `<span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">${s}</span>`).join('')}
          ${item.requiredSkills.length > 4 ? `<span class="text-[10px] text-slate-400">+${item.requiredSkills.length - 4} more</span>` : ''}
        </div>
      </div>
    `).join('');

    dropdown.classList.remove('hidden');

    // Add click listeners to items
    dropdown.querySelectorAll('.role-search-item').forEach(el => {
      el.addEventListener('click', () => {
        const roleId = el.getAttribute('data-role-id');
        const role = this.allRoles.find(r => r.roleId === roleId);
        if (role) {
          this.selectRole(role);
          dropdown.classList.add('hidden');
          const searchInput = document.getElementById('companySearchInput');
          if (searchInput) searchInput.value = `${role.companyName} — ${role.title}`;
        }
      });
    });
  }

  selectRole(role) {
    this.selectedRole = role;
    const targetBadge = document.getElementById('selectedTargetBadge');
    if (targetBadge) {
      targetBadge.innerHTML = `
        <div class="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl flex items-center justify-between">
          <div>
            <div class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Target Selected</div>
            <div class="text-base font-bold text-slate-900 dark:text-white">${role.companyName}</div>
            <div class="text-xs text-slate-600 dark:text-slate-300">${role.title} (${role.package})</div>
          </div>
          <div class="text-right text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            <div>${role.location}</div>
            <div class="font-medium text-indigo-600 dark:text-indigo-400 mt-1">${role.requiredSkills.length} Core Skills Needed</div>
          </div>
        </div>
      `;
    }
    if (window.audioAssistant) {
      window.audioAssistant.playClick();
    }
  }

  async handleFileUpload(file) {
    const statusText = document.getElementById('uploadStatusText');
    const textInput = document.getElementById('resumeTextInput');
    const errorBanner = document.getElementById('resumeInputError');
    if (errorBanner) errorBanner.classList.add('hidden');
    if (textInput) textInput.classList.remove('border-rose-500');

    if (statusText) {
      statusText.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">Processing ${file.name}...</span>`;
    }

    // Check if PDF file
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        if (window.pdfjsLib) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          let extractedText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            extractedText += strings.join(' ') + '\n';
          }
          if (extractedText.trim().length > 10) {
            if (textInput) textInput.value = extractedText.trim();
            if (statusText) {
              const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
              statusText.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-semibold">✓ ${file.name} (${wordCount} words loaded)</span>`;
            }
            if (window.audioAssistant) window.audioAssistant.playClick();
            return;
          }
        }
      } catch (pdfErr) {
        console.warn("PDF.js extraction fallback", pdfErr);
      }
    }

    // Standard text reader for .txt, .docx or other text files
    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target.result || '';
      // Clean null bytes if any
      content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
      if (textInput) {
        textInput.value = content;
      }
      if (statusText) {
        statusText.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-semibold">✓ ${file.name} loaded</span>`;
      }
      if (window.audioAssistant) window.audioAssistant.playClick();
    };
    reader.readAsText(file);
  }

  loadSampleResume(type) {
    const textInput = document.getElementById('resumeTextInput');
    const errorBanner = document.getElementById('resumeInputError');
    const statusText = document.getElementById('uploadStatusText');
    if (!textInput) return;

    if (errorBanner) errorBanner.classList.add('hidden');
    textInput.classList.remove('border-rose-500');

    if (type === 1) {
      // Tier-3 CSE Fresher
      textInput.value = `Rahul Sharma
B.Tech in Computer Science & Engineering (2021-2025)
Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow | CGPA: 8.2/10

TECHNICAL SKILLS:
- Languages: C++, Core Java, basic Python, SQL
- Web Technologies: HTML5, CSS3, JavaScript, React.js (Beginner)
- Core Concepts: Object-Oriented Programming (OOP), DBMS, Computer Networks, Operating Systems
- Tools: Git, GitHub, VS Code, MySQL Workbench

PROJECTS:
1. Online Book Library Management System (Java, MySQL, JDBC)
   - Built a desktop management application for college library with book issue/return tracking.
   - Designed normalized relational database tables and handled SQL exceptions.
2. Personal Portfolio & Weather App (HTML, CSS, JavaScript, Weather API)
   - Created responsive personal website hosted on GitHub Pages with live city weather lookup.

ACHIEVEMENTS:
- Solved 120 problems on GeeksforGeeks and LeetCode (Arrays, Strings, Recursion).
- Participated in Smart India Hackathon internal college round.`;
    } else if (type === 2) {
      // Non-CS Aspirant
      textInput.value = `Pooja Verma
Bachelor of Science (B.Sc. Mathematics & Statistics)
University of Delhi | Percentage: 84.5%

TECHNICAL PROFILE:
- Programming: Python (Pandas, NumPy, Matplotlib, Seaborn)
- Data & Databases: SQL, MySQL, Advanced Excel (VLOOKUP, Pivot Tables, XLOOKUP)
- Business Intelligence: Power BI dashboard design, Data Cleaning & Preprocessing
- Quantitative Skills: Probability distributions, Hypothesis Testing, Linear Regression

PROJECTS:
1. E-Commerce Sales Trend Dashboard (Power BI, Excel)
   - Modeled 50,000 transaction records to extract monthly revenue trends and return rates.
   - Built interactive drill-down visuals for regional store managers.
2. Customer Churn Exploratory Analysis (Python Pandas)
   - Cleaned messy telecom data, imputed missing values, and correlated churn with tenure.`;
    } else if (type === 3) {
      // Full Stack MERN Dev
      textInput.value = `Ankit Patel
B.E. Information Technology (2020-2024)
Gujarat Technological University (GTU) | CGPA: 8.7/10

SKILLS:
- Frontend: JavaScript (ES6+), TypeScript, React.js, Redux Toolkit, Tailwind CSS, Next.js
- Backend: Node.js, Express.js, RESTful API design, JWT Authentication, Microservices basics
- Databases: MongoDB, Mongoose, PostgreSQL, Redis caching
- DevOps & Cloud: Docker, Git/GitHub, AWS S3, CI/CD with GitHub Actions

PROJECTS:
1. DevFlow - Realtime Collaborative Code & Whiteboard Tool
   - Full stack web app with Socket.io live streaming, Monaco editor, and JWT auth.
   - Integrated Redis Pub/Sub for broadcast events and MongoDB for session persistence.
2. Scalable Micro-Blogging API (Node.js, PostgreSQL, Docker)
   - Designed relational database schema, implemented rate-limiting with Redis, unit tested with Jest.
   - Containerized with Docker and deployed on AWS EC2.`;
    }

    if (statusText) {
      statusText.innerHTML = `<span class="text-indigo-600 dark:text-indigo-400 font-semibold">✓ Sample ${type} Loaded</span>`;
    }

    if (window.audioAssistant) window.audioAssistant.playClick();
  }

  runAnalysis() {
    const textInput = document.getElementById('resumeTextInput');
    const errorBanner = document.getElementById('resumeInputError');
    const analyzeBtn = document.getElementById('runGapAnalysisBtn');
    const resumeText = textInput ? textInput.value.trim() : '';

    if (!resumeText) {
      if (errorBanner) {
        errorBanner.textContent = "Please upload your resume file, paste resume text, or load a Sample Resume to begin!";
        errorBanner.classList.remove('hidden');
      }
      if (textInput) {
        textInput.classList.add('border-rose-500');
        textInput.focus();
      }
      return;
    } else {
      if (errorBanner) errorBanner.classList.add('hidden');
      if (textInput) textInput.classList.remove('border-rose-500');
    }

    // Visual button state
    if (analyzeBtn) {
      const originalText = analyzeBtn.innerHTML;
      analyzeBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing Skill Gaps...`;
      analyzeBtn.disabled = true;
      setTimeout(() => {
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
      }, 700);
    }

    // Check if custom company was specified
    const customCompanyInput = document.getElementById('customCompanyInput');
    const customRoleInput = document.getElementById('customRoleInput');
    let target = this.selectedRole;

    if (customCompanyInput && customRoleInput && customCompanyInput.value.trim() && customRoleInput.value.trim()) {
      target = {
        companyName: customCompanyInput.value.trim(),
        title: customRoleInput.value.trim(),
        package: "Competitive Industry Package",
        location: "Pan-India",
        requiredSkills: ["Data Structures & Algorithms", "Clean Code", "System Design", "Databases & SQL", "Version Control (Git)", "Problem Solving"],
        bonusSkills: ["Cloud Platforms (AWS/Azure)", "Docker", "CI/CD", "Automated Testing"]
      };
    }

    // Fallback if no target selected
    if (!target) {
      if (this.allRoles && this.allRoles.length > 0) {
        target = this.allRoles[0];
        this.selectRole(target);
      } else {
        target = {
          companyName: "TCS",
          title: "Systems Engineer (Prime)",
          package: "₹9.0 - ₹11.5 LPA",
          location: "Pan-India",
          requiredSkills: ["Data Structures & Algorithms", "Java", "Python", "System Design Basics", "SQL & DBMS", "Git"],
          bonusSkills: ["Cloud (AWS/Azure)", "Docker", "Microservices"]
        };
      }
    }

    // Execute skill matching logic
    const analysis = this.computeSkillGap(resumeText, target);
    this.currentAnalysis = analysis;

    // Render results in UI
    this.renderAnalysisResult(analysis);

    // Save to localStorage for Student Dashboard
    this.saveScanToHistory(analysis);

    // Trigger celebration sound & effect
    if (window.audioAssistant) {
      window.audioAssistant.playCelebration();
    }

    // Scroll to results
    const resultsContainer = document.getElementById('gapAnalysisResults');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  computeSkillGap(resumeText, target) {
    const textLower = resumeText.toLowerCase();

    // Skill aliases dictionary for flexible recognition
    const skillAliases = {
      "Data Structures & Algorithms": ["dsa", "data structures", "algorithms", "trees", "graphs", "dynamic programming", "leetcode", "geeksforgeeks"],
      "Java": ["java", "spring", "springboot", "spring boot", "jvm", "j2ee"],
      "Python": ["python", "django", "flask", "fastapi", "pandas", "numpy"],
      "C/C++": ["c++", "cpp", "c programming", "stl"],
      "JavaScript (ES6+)": ["javascript", "js", "es6", "vanilla js", "typescript", "ts"],
      "React.js": ["react", "react.js", "reactjs", "redux", "next.js", "nextjs"],
      "SQL & DBMS": ["sql", "mysql", "postgresql", "dbms", "database", "rdbms", "oracle"],
      "System Design": ["system design", "distributed systems", "scalability", "lld", "hld", "architecture"],
      "System Design Basics": ["system design", "architecture", "microservices", "caching", "scaling"],
      "Git": ["git", "github", "gitlab", "version control"],
      "Cloud (AWS/Azure)": ["aws", "azure", "gcp", "cloud", "s3", "ec2", "lambda"],
      "Docker": ["docker", "container", "containers", "kubernetes", "k8s"],
      "Microservices": ["microservices", "microservice", "rest api", "apis", "kafka", "rabbitmq"],
      "Node.js & Express": ["node", "nodejs", "node.js", "express", "expressjs"],
      "PostgreSQL / MySQL": ["postgres", "postgresql", "mysql", "aurora", "sqlite"],
      "Low Level Design (LLD)": ["lld", "low level design", "design patterns", "solid principles", "oops"],
      "Object-Oriented Programming": ["oop", "oops", "object oriented", "polymorphism", "inheritance", "encapsulation"],
      "Clean Code": ["clean code", "refactoring", "unit tests", "modular"],
      "Computer Networks": ["computer networks", "networking", "tcp/ip", "http", "https", "dns", "osi"],
      "Operating Systems": ["operating systems", "os", "linux", "concurrency", "threads", "processes"]
    };

    const matched = [];
    const missing = [];
    const matchedBonus = [];
    const missingBonus = [];

    // Check required skills
    target.requiredSkills.forEach(skill => {
      let isFound = false;
      const aliases = skillAliases[skill] || [skill.toLowerCase()];
      for (const alias of aliases) {
        if (textLower.includes(alias.toLowerCase())) {
          isFound = true;
          break;
        }
      }
      if (isFound) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    // Check bonus skills
    if (target.bonusSkills) {
      target.bonusSkills.forEach(skill => {
        let isFound = false;
        const aliases = skillAliases[skill] || [skill.toLowerCase()];
        for (const alias of aliases) {
          if (textLower.includes(alias.toLowerCase())) {
            isFound = true;
            break;
          }
        }
        if (isFound) {
          matchedBonus.push(skill);
        } else {
          missingBonus.push(skill);
        }
      });
    }

    // Weighted match score calculation
    const totalRequired = target.requiredSkills.length;
    const requiredWeight = 80;
    const bonusWeight = 20;

    const reqScore = totalRequired > 0 ? (matched.length / totalRequired) * requiredWeight : 50;
    const bonusScore = target.bonusSkills && target.bonusSkills.length > 0 
      ? (matchedBonus.length / target.bonusSkills.length) * bonusWeight 
      : 15;

    let totalScore = Math.round(reqScore + bonusScore);
    if (totalScore > 98) totalScore = 98;
    if (totalScore < 30) totalScore = 32;

    // Tailored roadmap generation
    const roadmap = this.generate15DayRoadmap(target, missing, missingBonus);

    return {
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      company: target.companyName,
      role: target.title,
      package: target.package,
      score: totalScore,
      matchedSkills: matched,
      missingSkills: missing,
      matchedBonus: matchedBonus,
      missingBonus: missingBonus,
      roadmap: roadmap
    };
  }

  generate15DayRoadmap(target, missingSkills, missingBonus) {
    const focus1 = missingSkills[0] || "Advanced Data Structures & Graph Algorithms";
    const focus2 = missingSkills[1] || "System Architecture & High-throughput Caching";
    const bonusFocus = missingBonus[0] || "Containerization & Cloud CI/CD Pipelines";

    return {
      phase1: {
        title: "Phase 1: Days 1–5 • Core Foundations & Missing Fundamentals",
        goal: `Close foundational knowledge gaps in ${focus1} and core engineering paradigms.`,
        days: [
          { day: "Day 1-2", task: `Deep dive into ${focus1}: Master core theoretical fundamentals and solve 15 medium-level pattern problems.` },
          { day: "Day 3-4", task: `Implement hands-on code: Write modular, clean implementations without using high-level blackbox libraries.` },
          { day: "Day 5", task: `Benchmark time & space complexity proofs; practice writing clear comments and edge-case validations.` }
        ]
      },
      phase2: {
        title: "Phase 2: Days 6–10 • Capstone Real-World Project Implementation",
        goal: `Build a production-grade portfolio project demonstrating ${focus2} and ${bonusFocus}.`,
        days: [
          { day: "Day 6-7", task: `Architect project repository: Design DB schema, establish REST/gRPC contracts, and configure Docker compose.` },
          { day: "Day 8-9", task: `Implement core business logic with concurrency handling, caching layer (Redis), and connection pooling.` },
          { day: "Day 10", task: `Deploy to public cloud (AWS/Render/Vercel) with live demo URL, interactive Swagger docs, and GitHub README with architecture diagram.` }
        ]
      },
      phase3: {
        title: "Phase 3: Days 11–15 • System Design, STAR Stories & Final Placement Polish",
        goal: `Refine your resume bullets using metric-backed STAR format and prepare role-specific behavioral responses.`,
        days: [
          { day: "Day 11-12", task: `Rewrite resume project bullets: Use quantifiable impact verbs (e.g., 'Reduced query latency by 45% using Redis caching').` },
          { day: "Day 13-14", task: `Simulate mock interviews for ${target.companyName} with Margdarshak AI's Interactive Mock Interviewer.` },
          { day: "Day 15", task: `Final elevator pitch rehearsal, review company engineering blogs, and submit applications with 90%+ readiness.` }
        ]
      }
    };
  }

  renderAnalysisResult(analysis) {
    const scoreVal = document.getElementById('matchScoreValue');
    const scoreLabel = document.getElementById('matchScoreTier');
    const scoreCircle = document.getElementById('matchScoreSvgCircle');
    const roleHeading = document.getElementById('analysisResultRoleHeading');
    const matchedContainer = document.getElementById('matchedSkillsBadges');
    const missingContainer = document.getElementById('missingSkillsBadges');
    const bonusContainer = document.getElementById('recommendedSkillsBadges');
    const roadmapContainer = document.getElementById('roadmapContentContainer');

    if (roleHeading) {
      roleHeading.textContent = `${analysis.company} — ${analysis.role} (${analysis.package})`;
    }

    // Animate SVG circle
    if (scoreCircle && scoreVal) {
      const radius = 54;
      const circumference = 2 * Math.PI * radius;
      scoreCircle.style.strokeDasharray = `${circumference}`;
      
      const offset = circumference - (analysis.score / 100) * circumference;
      
      let colorClass = "stroke-emerald-500";
      let tier = "Exceptional Match • Placement Ready!";
      if (analysis.score < 60) {
        colorClass = "stroke-amber-500";
        tier = "Foundational Match • Requires Targeted Prep";
      } else if (analysis.score < 80) {
        colorClass = "stroke-indigo-500";
        tier = "Strong Contender • Close Remaining Gaps";
      }

      // Set SVG class attribute safely
      scoreCircle.setAttribute('class', `transition-all duration-1000 ease-out ${colorClass}`);
      scoreCircle.style.strokeDashoffset = `${offset}`;
      
      // Animate score number counter
      let current = 0;
      const timer = setInterval(() => {
        current += 2;
        if (current >= analysis.score) {
          current = analysis.score;
          clearInterval(timer);
        }
        scoreVal.textContent = `${current}%`;
      }, 20);

      if (scoreLabel) scoreLabel.textContent = tier;
    }

    // Render Matched Skills
    if (matchedContainer) {
      matchedContainer.innerHTML = analysis.matchedSkills.length > 0 
        ? analysis.matchedSkills.map(s => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            ${s}
          </span>
        `).join('')
        : `<span class="text-xs text-slate-400 italic">No exact critical skills matched yet. Follow roadmap below!</span>`;
    }

    // Render Missing Skills
    if (missingContainer) {
      missingContainer.innerHTML = analysis.missingSkills.length > 0
        ? analysis.missingSkills.map(s => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            ${s}
          </span>
        `).join('')
        : `<span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">🎉 All core skills matched!</span>`;
    }

    // Render Recommended Bonus Skills
    if (bonusContainer) {
      const allBonus = [...analysis.matchedBonus.map(b => ({ name: b, matched: true })), ...analysis.missingBonus.map(b => ({ name: b, matched: false }))];
      bonusContainer.innerHTML = allBonus.length > 0
        ? allBonus.map(b => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${b.matched ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
            ${b.matched ? '★ ' : '○ '}${b.name}
          </span>
        `).join('')
        : `<span class="text-xs text-slate-400">No additional skills listed.</span>`;
    }

    // Render Roadmap
    if (roadmapContainer && analysis.roadmap) {
      const r = analysis.roadmap;
      roadmapContainer.innerHTML = `
        <div class="space-y-4">
          <!-- Phase 1 -->
          <div class="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">${r.phase1.title}</span>
              <span class="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium">Foundations</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">${r.phase1.goal}</p>
            <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              ${r.phase1.days.map(d => `<li class="flex items-start gap-2"><span class="font-bold text-indigo-500 whitespace-nowrap">${d.day}:</span> <span>${d.task}</span></li>`).join('')}
            </ul>
          </div>

          <!-- Phase 2 -->
          <div class="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">${r.phase2.title}</span>
              <span class="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium">Project Build</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">${r.phase2.goal}</p>
            <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              ${r.phase2.days.map(d => `<li class="flex items-start gap-2"><span class="font-bold text-purple-500 whitespace-nowrap">${d.day}:</span> <span>${d.task}</span></li>`).join('')}
            </ul>
          </div>

          <!-- Phase 3 -->
          <div class="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">${r.phase3.title}</span>
              <span class="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium">Placement Ready</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">${r.phase3.goal}</p>
            <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              ${r.phase3.days.map(d => `<li class="flex items-start gap-2"><span class="font-bold text-emerald-500 whitespace-nowrap">${d.day}:</span> <span>${d.task}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
  }

  evaluatePitch() {
    const pitchInput = document.getElementById('pitchTextInput');
    const pitchFeedbackBox = document.getElementById('pitchFeedbackContainer');
    const pitchText = pitchInput ? pitchInput.value.trim() : '';

    if (!pitchText) {
      alert("Please enter or paste your elevator introduction pitch first!");
      return;
    }

    const words = pitchText.split(/\s+/).length;
    const hasNumbers = /\d+/.test(pitchText);
    const hasProjects = /project|built|developed|created|architected/i.test(pitchText);
    const hasRole = /engineer|developer|analyst|software/i.test(pitchText);
    const hasPassion = /passionate|excited|motivated|strive/i.test(pitchText);

    let score = 5;
    const strengths = [];
    const missingCritique = [];

    if (words >= 40 && words <= 130) {
      score += 1.5;
      strengths.push("Ideal pitch duration (concise 45-75 seconds spoken delivery).");
    } else if (words < 40) {
      missingCritique.push("Pitch is too brief. Elaborate on your technical project and specific role impact.");
    } else {
      missingCritique.push("Pitch is overly lengthy. Trim background details to avoid losing the interviewer's attention.");
    }

    if (hasNumbers) {
      score += 1.5;
      strengths.push("Excellent inclusion of measurable metrics/numbers (quantified impact).");
    } else {
      missingCritique.push("Missing quantifiable metrics (e.g. 'solved 200+ questions', 'reduced latency by 30%', '8.5 CGPA').");
    }

    if (hasProjects) {
      score += 1;
      strengths.push("Direct reference to hands-on software development projects.");
    } else {
      missingCritique.push("Lacks explicit mention of a standout technical project or engineering challenge.");
    }

    if (hasRole) {
      score += 1;
      strengths.push("Strong professional alignment with target software engineering role.");
    } else {
      missingCritique.push("Didn't explicitly anchor yourself to the specific target role title.");
    }

    if (score > 9.5) score = 9.5;

    const company = this.selectedRole ? this.selectedRole.companyName : "Top Tech";
    const role = this.selectedRole ? this.selectedRole.title : "Software Development Engineer";

    const polishedPitch = `Hello! I am a final-year engineering student specializing in scalable systems and data-driven development. Over the past two years, I have built practical applications using modern architectures, including a high-performance project where I optimized data throughput and improved response times by over 40%. I have solved over 250 algorithmic problems with an emphasis on clean code and low-latency design. I have been following ${company}'s work in large-scale platforms, and I am eager to bring my problem-solving drive and fast learning agility to the ${role} team.`;

    if (pitchFeedbackBox) {
      pitchFeedbackBox.classList.remove('hidden');
      pitchFeedbackBox.innerHTML = `
        <div class="mt-4 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Pitch Diagnostic</div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">Pitch Effectiveness: <span class="text-indigo-600 dark:text-indigo-400">${score.toFixed(1)} / 10</span></div>
            </div>
            <div class="text-xs px-3 py-1 rounded-full ${score >= 7.5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'} font-semibold">
              ${score >= 7.5 ? 'Interview Ready' : 'Needs Optimization'}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                What You Did Well:
              </div>
              <ul class="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                ${strengths.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            <div>
              <div class="font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Points You Missed / Can Add:
              </div>
              <ul class="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                ${missingCritique.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div class="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
              <span>✨ Recommended High-Impact Elevator Pitch Script:</span>
              <button id="copyPitchScriptBtn" class="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-semibold">Copy Script</button>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "${polishedPitch}"
            </div>
          </div>
        </div>
      `;

      const copyBtn = document.getElementById('copyPitchScriptBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(polishedPitch);
          copyBtn.textContent = "Copied! ✓";
          setTimeout(() => { copyBtn.textContent = "Copy Script"; }, 2000);
        });
      }
    }

    if (window.audioAssistant) window.audioAssistant.playNextChime();
  }

  saveScanToHistory(analysis) {
    try {
      const existing = JSON.parse(localStorage.getItem('margdarshak_resume_scans') || '[]');
      existing.unshift(analysis);
      // Keep last 15
      localStorage.setItem('margdarshak_resume_scans', JSON.stringify(existing.slice(0, 15)));
      // Also update student current target
      localStorage.setItem('margdarshak_current_target', JSON.stringify({
        company: analysis.company,
        role: analysis.role,
        score: analysis.score
      }));

      // Cloud DB Sync (Multi-User)
      const userId = window.studentAuth?.getUserId() || 'usr_demo';
      fetch('/api/dashboard/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({
          company: analysis.company,
          role: analysis.role,
          package: analysis.package,
          score: analysis.score,
          matchedSkills: analysis.matchedSkills,
          missingSkills: analysis.missingSkills,
          matchedBonus: analysis.matchedBonus,
          missingBonus: analysis.missingBonus,
          roadmap: analysis.roadmap
        })
      }).catch(err => console.warn("Cloud DB sync note (offline fallback):", err));

      // Notify dashboard if available
      if (window.studentDashboard) {
        window.studentDashboard.loadDashboardData();
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
  }
}

// Global initialization
window.gapAnalyzer = new GapAnalyzer();
