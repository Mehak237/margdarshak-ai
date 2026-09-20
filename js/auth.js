// Margdarshak AI - Student Authentication & Cloud Profile Controller
// Foolproof Hybrid Auth: Supports Server REST API + Instant Local Storage Fallback

class StudentAuth {
  constructor() {
    this.initLocalUserDatabase();
    this.currentUser = this.loadStoredUser();
    this.init();
  }

  // Pre-seed local database with demo accounts so offline & static users can always log in
  initLocalUserDatabase() {
    try {
      const existing = localStorage.getItem('margdarshak_all_users');
      if (!existing) {
        const seedUsers = [
          {
            id: "usr_demo",
            name: "Rahul Sharma",
            email: "student@margdarshak.edu.in",
            password: "password123",
            college: "AKTU (Tier-2 Engineering)",
            targetCompany: "Tata Consultancy Services (TCS)",
            targetRole: "Systems Engineer (Prime / 9 LPA)",
            readinessScore: 78
          },
          {
            id: "usr_priya",
            name: "Priya Patel",
            email: "priya@margdarshak.edu.in",
            password: "password123",
            college: "GTU Ahmedabad",
            targetCompany: "Flipkart",
            targetRole: "SDE-1 (Frontend / 18 LPA)",
            readinessScore: 84
          }
        ];
        localStorage.setItem('margdarshak_all_users', JSON.stringify(seedUsers));
      }
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }

  getRegisteredUsers() {
    try {
      const data = localStorage.getItem('margdarshak_all_users');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveUserToLocalDb(user) {
    try {
      const users = this.getRegisteredUsers();
      const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...user };
      } else {
        users.push(user);
      }
      localStorage.setItem('margdarshak_all_users', JSON.stringify(users));
    } catch (e) {
      console.warn("Error saving user locally:", e);
    }
  }

  loadStoredUser() {
    try {
      const stored = localStorage.getItem('margdarshak_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading stored user:", e);
    }
    // Return null by default so user sees the "Sign In" button clearly
    return null;
  }

  init() {
    this.bindEvents();
    this.updateNavbarUI();
  }

  bindEvents() {
    // 1. Universal Document-Level Click Handler (Event Delegation)
    // Ensures dynamically rendered buttons always work
    document.addEventListener('click', (e) => {
      // Open Auth Modal
      const authOpenTrigger = e.target.closest('[data-action="open-auth-modal"]');
      if (authOpenTrigger) {
        e.preventDefault();
        const tab = authOpenTrigger.getAttribute('data-tab') || 'login';
        this.openModal(tab);
        return;
      }

      // Logout Action
      const logoutTrigger = e.target.closest('[data-action="student-logout"]');
      if (logoutTrigger) {
        e.preventDefault();
        this.logout();
        return;
      }

      // Toggle Navbar User Dropdown Menu
      const menuBtn = e.target.closest('#navUserMenuBtn');
      const userDropdown = document.getElementById('navUserDropdownMenu');
      if (menuBtn && userDropdown) {
        e.preventDefault();
        userDropdown.classList.toggle('hidden');
        return;
      }

      // Close dropdown when clicking outside
      if (userDropdown && !e.target.closest('#navUserMenuBtn') && !e.target.closest('#navUserDropdownMenu')) {
        userDropdown.classList.add('hidden');
      }

      // Modal Backdrop Click (close modal)
      const modal = document.getElementById('authModal');
      if (modal && e.target === modal) {
        this.closeModal();
      }
    });

    // Close Modal Button
    const closeBtn = document.getElementById('closeAuthModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Tab Switchers inside Auth Modal
    const tabLoginBtn = document.getElementById('authTabBtnLogin');
    const tabRegBtn = document.getElementById('authTabBtnRegister');
    if (tabLoginBtn && tabRegBtn) {
      tabLoginBtn.addEventListener('click', () => this.switchAuthTab('login'));
      tabRegBtn.addEventListener('click', () => this.switchAuthTab('register'));
    }

    // Login Form Submit
    const loginForm = document.getElementById('studentLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Register Form Submit
    const regForm = document.getElementById('studentRegisterForm');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }

    // 1-Click Demo Login: Rahul Sharma
    const demoRahulBtn = document.getElementById('authDemoRahulBtn');
    if (demoRahulBtn) {
      demoRahulBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.loginWithCredentials("student@margdarshak.edu.in", "password123");
      });
    }

    // 1-Click Demo Login: Priya Patel
    const demoPriyaBtn = document.getElementById('authDemoPriyaBtn');
    if (demoPriyaBtn) {
      demoPriyaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.loginWithCredentials("priya@margdarshak.edu.in", "password123");
      });
    }
  }

  openModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.remove('hidden');
      this.switchAuthTab(tab);
      this.clearNotice();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.add('hidden');
      this.clearNotice();
    }
  }

  switchAuthTab(tab) {
    const tabLoginBtn = document.getElementById('authTabBtnLogin');
    const tabRegBtn = document.getElementById('authTabBtnRegister');
    const formLogin = document.getElementById('authPaneLogin');
    const formReg = document.getElementById('authPaneRegister');

    if (tab === 'login') {
      tabLoginBtn?.classList.add('border-indigo-600', 'text-indigo-600', 'dark:text-indigo-400');
      tabLoginBtn?.classList.remove('border-transparent', 'text-slate-500');
      tabRegBtn?.classList.remove('border-indigo-600', 'text-indigo-600', 'dark:text-indigo-400');
      tabRegBtn?.classList.add('border-transparent', 'text-slate-500');

      formLogin?.classList.remove('hidden');
      formReg?.classList.add('hidden');
    } else {
      tabRegBtn?.classList.add('border-indigo-600', 'text-indigo-600', 'dark:text-indigo-400');
      tabRegBtn?.classList.remove('border-transparent', 'text-slate-500');
      tabLoginBtn?.classList.remove('border-indigo-600', 'text-indigo-600', 'dark:text-indigo-400');
      tabLoginBtn?.classList.add('border-transparent', 'text-slate-500');

      formLogin?.classList.add('hidden');
      formReg?.classList.remove('hidden');
    }
    this.clearNotice();
    if (window.lucide) window.lucide.createIcons();
  }

  setNotice(msg, isError = false) {
    const notice = document.getElementById('authModalNotice');
    if (notice) {
      notice.classList.remove('hidden');
      notice.className = `p-3 rounded-xl text-xs font-semibold ${
        isError 
          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900' 
          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
      }`;
      notice.textContent = msg;
    }
  }

  clearNotice() {
    const notice = document.getElementById('authModalNotice');
    if (notice) {
      notice.classList.add('hidden');
      notice.textContent = '';
    }
  }

  async handleLogin() {
    const emailInput = document.getElementById('authLoginEmail');
    const passwordInput = document.getElementById('authLoginPassword');
    const email = emailInput?.value.trim();
    const password = passwordInput?.value;
    const submitBtn = document.getElementById('authLoginSubmitBtn');

    if (!email || !password) {
      this.setNotice("Please enter your email and password.", true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">⏳</span> Signing In...`;
    }

    await this.loginWithCredentials(email, password);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Sign In to Margdarshak`;
    }
  }

  async loginWithCredentials(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Check Local User Database
    const localUsers = this.getRegisteredUsers();
    const localMatch = localUsers.find(u => u.email.toLowerCase() === cleanEmail);

    // 2. Try Backend API
    let serverUser = null;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          serverUser = data.user;
        }
      }
    } catch (networkErr) {
      // Backend offline or running in file:// / static preview
      console.log("Backend offline or unreachable, using local auth database");
    }

    // 3. Authenticate using Server or Local Match
    const authenticatedUser = serverUser || localMatch;

    if (authenticatedUser) {
      // Password validation check
      if (authenticatedUser.password && authenticatedUser.password !== cleanPassword) {
        this.setNotice("Incorrect password. Please try again or use a demo login.", true);
        return;
      }

      this.setCurrentUser(authenticatedUser);
      this.saveUserToLocalDb(authenticatedUser);
      this.setNotice(`Welcome back, ${authenticatedUser.name}! 🚀`, false);

      setTimeout(() => {
        this.closeModal();
        if (window.margdarshakApp?.triggerConfetti) {
          window.margdarshakApp.triggerConfetti();
        }
      }, 500);
      return;
    }

    // 4. User not found: Provide clean feedback & option to auto-register
    this.setNotice(
      `No student account found for "${cleanEmail}". Click the "Create Account" tab above to register for free!`,
      true
    );
  }

  async handleRegister() {
    const name = document.getElementById('authRegName')?.value.trim();
    const email = document.getElementById('authRegEmail')?.value.trim().toLowerCase();
    const password = document.getElementById('authRegPassword')?.value;
    const college = document.getElementById('authRegCollege')?.value.trim() || 'Tier-2/3 Engineering College';
    const targetCompany = document.getElementById('authRegCompany')?.value.trim() || 'Tata Consultancy Services (TCS)';
    const targetRole = document.getElementById('authRegRole')?.value.trim() || 'Systems Engineer';
    const submitBtn = document.getElementById('authRegSubmitBtn');

    if (!name || !email || !password) {
      this.setNotice("Name, Email, and Password are required.", true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">⏳</span> Creating Account...`;
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name,
      email,
      password,
      college,
      targetCompany,
      targetRole,
      readinessScore: 70,
      createdAt: new Date().toISOString()
    };

    // Save to local user database
    this.saveUserToLocalDb(newUser);

    // Also attempt to sync with backend server if available
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (e) {
      console.log("Account saved to local database (server offline)");
    }

    this.setCurrentUser(newUser);
    this.setNotice(`Account created successfully! Welcome, ${name}! 🎉`, false);

    setTimeout(() => {
      this.closeModal();
      if (window.margdarshakApp?.triggerConfetti) {
        window.margdarshakApp.triggerConfetti();
      }
    }, 600);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Create Free Student Account`;
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem('margdarshak_user', JSON.stringify(user));
    
    // Also update target company in dashboard target
    if (user.targetCompany) {
      localStorage.setItem('margdarshak_current_target', JSON.stringify({
        company: user.targetCompany,
        role: user.targetRole || "Systems Engineer",
        score: user.readinessScore || 70
      }));
    }

    this.updateNavbarUI();

    // Reload student dashboard with updated user
    if (window.studentDashboard) {
      window.studentDashboard.loadDashboardData();
    }

    if (window.audioAssistant) {
      window.audioAssistant.playCelebration();
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('margdarshak_user');
    this.updateNavbarUI();

    if (window.studentDashboard) {
      window.studentDashboard.loadDashboardData();
    }
    if (window.audioAssistant) {
      window.audioAssistant.playClick();
    }
  }

  updateNavbarUI() {
    const container = document.getElementById('navAuthContainer');
    const mobileContainer = document.getElementById('mobileAuthContainer');
    if (!container) return;

    if (this.currentUser) {
      const initials = (this.currentUser.name || 'Student')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

      const html = `
        <div class="relative">
          <button id="navUserMenuBtn" type="button" class="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition text-left cursor-pointer">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              ${initials}
            </div>
            <div class="hidden lg:block text-left leading-tight">
              <div class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">${this.currentUser.name}</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[110px]">${this.currentUser.college || 'Student'}</div>
            </div>
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          <!-- Dropdown Menu -->
          <div id="navUserDropdownMenu" class="hidden absolute right-0 mt-2 w-60 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <div class="text-xs font-bold text-slate-900 dark:text-white">${this.currentUser.name}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${this.currentUser.email}</div>
              <div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                🎯 ${this.currentUser.targetCompany || 'Target Not Set'}
              </div>
            </div>
            <div class="py-1.5 space-y-1">
              <a href="#dashboard" data-nav-target="dashboard" class="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition">
                <span>📊</span> My Student Dashboard
              </a>
              <button type="button" data-action="open-auth-modal" data-tab="login" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer">
                <span>🔄</span> Switch Student Account
              </button>
            </div>
            <div class="pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <button type="button" data-action="student-logout" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition font-semibold cursor-pointer">
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        </div>
      `;
      container.innerHTML = html;

      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <div class="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 mb-2">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                ${initials}
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900 dark:text-white">${this.currentUser.name}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400">${this.currentUser.targetCompany || 'Tier-2 Aspirant'}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" data-action="open-auth-modal" data-tab="login" class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
                Switch
              </button>
              <button type="button" data-action="student-logout" class="text-[11px] text-rose-600 dark:text-rose-400 font-semibold px-2 py-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 transition">
                Sign Out
              </button>
            </div>
          </div>
        `;
      }
    } else {
      const html = `
        <button type="button" data-action="open-auth-modal" data-tab="login" class="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span>Sign In</span>
        </button>
      `;
      container.innerHTML = html;

      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <button type="button" data-action="open-auth-modal" data-tab="login" class="w-full text-center py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm mb-2 transition cursor-pointer">
            Sign In / Register Student Account
          </button>
        `;
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  getUserId() {
    return this.currentUser?.id || 'usr_demo';
  }
}

// Global initialization
window.studentAuth = new StudentAuth();
