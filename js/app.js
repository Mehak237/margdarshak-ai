// Margdarshak AI - Core Application Controller
// Handles tab navigation, multilingual switching (9 Indian languages), dark/light theme, and UI confetti

class MargdarshakApp {
  constructor() {
    this.currentLanguage = localStorage.getItem('margdarshak_lang') || 'en';
    this.currentTheme = localStorage.getItem('margdarshak_theme') || 'dark'; // Default to sleek dark mode
    this.activeTab = 'home';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindNavigation();
    this.bindLanguageSwitcher();
    this.bindThemeToggle();
    this.bindMobileMenu();
    this.applyTranslations(this.currentLanguage);
  }

  bindNavigation() {
    // Nav links
    const navLinks = document.querySelectorAll('[data-nav-target]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-nav-target');
        this.switchTab(target);
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    });

    // Hash change handler
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'gap', 'scholarship', 'mock', 'dashboard'].includes(hash)) {
        this.switchTab(hash);
      }
    });

    // Initial check from URL
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['home', 'gap', 'scholarship', 'mock', 'dashboard'].includes(initialHash)) {
      this.switchTab(initialHash);
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    window.location.hash = tabId;

    // Update active navbar styling
    document.querySelectorAll('[data-nav-target]').forEach(link => {
      const target = link.getAttribute('data-nav-target');
      if (target === tabId) {
        link.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-bold');
        link.classList.remove('text-slate-600', 'dark:text-slate-300');
      } else {
        link.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'font-bold');
        link.classList.add('text-slate-600', 'dark:text-slate-300');
      }
    });

    // Show/hide sections
    const tabs = ['home', 'gap', 'scholarship', 'mock', 'dashboard'];
    tabs.forEach(t => {
      const section = document.getElementById(`section-${t}`);
      if (section) {
        if (t === tabId) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      }
    });

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenuDropdown');
    if (mobileMenu) mobileMenu.classList.add('hidden');

    // Scroll to top of section
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If opening dashboard, refresh stats
    if (tabId === 'dashboard' && window.studentDashboard) {
      window.studentDashboard.loadDashboardData();
    }
  }

  bindThemeToggle() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const next = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    }
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('margdarshak_theme', theme);

    const html = document.documentElement;
    const themeIconDark = document.getElementById('themeIconDark');
    const themeIconLight = document.getElementById('themeIconLight');

    if (theme === 'dark') {
      html.classList.add('dark');
      if (themeIconDark) themeIconDark.classList.remove('hidden');
      if (themeIconLight) themeIconLight.classList.add('hidden');
    } else {
      html.classList.remove('dark');
      if (themeIconDark) themeIconDark.classList.add('hidden');
      if (themeIconLight) themeIconLight.classList.remove('hidden');
    }
  }

  bindLanguageSwitcher() {
    const langSelect = document.getElementById('languageSelectorDropdown');
    if (langSelect) {
      langSelect.value = this.currentLanguage;
      langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        this.setLanguage(selectedLang);
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    }
  }

  setLanguage(lang) {
    if (!window.translations || !window.translations[lang]) return;
    this.currentLanguage = lang;
    localStorage.setItem('margdarshak_lang', lang);
    this.applyTranslations(lang);
  }

  applyTranslations(lang) {
    const t = window.translations ? window.translations[lang] : null;
    if (!t) return;

    // Apply text to all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Apply placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.placeholder = t[key];
      }
    });

    // Update dynamic taglines and brand
    const brandTagline = document.getElementById('brandTaglineText');
    if (brandTagline && t.tagline) {
      brandTagline.textContent = t.tagline;
    }
  }

  bindMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuToggleBtn');
    const mobileDropdown = document.getElementById('mobileMenuDropdown');
    if (mobileBtn && mobileDropdown) {
      mobileBtn.addEventListener('click', () => {
        mobileDropdown.classList.toggle('hidden');
      });
    }

    const mobileShareBtn = document.getElementById('mobileShareBtn');
    if (mobileShareBtn) {
      mobileShareBtn.addEventListener('click', () => {
        mobileDropdown?.classList.add('hidden');
        this.openShareModal();
      });
    }

    const mobileGeminiBtn = document.getElementById('mobileGeminiBtn');
    if (mobileGeminiBtn) {
      mobileGeminiBtn.addEventListener('click', () => {
        mobileDropdown?.classList.add('hidden');
        this.openGeminiModal();
      });
    }
  }

  // Progressive Web App (PWA) Offline & Install Controller
  initPWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('Margdarshak PWA SW registered:', reg.scope))
          .catch(err => console.warn('PWA SW registration note:', err));
      });
    }

    // Handle BeforeInstallPrompt for Android / Chrome install banner
    let deferredPrompt = null;
    const installBtn = document.getElementById('pwaInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) {
        installBtn.classList.remove('hidden');
        installBtn.addEventListener('click', async () => {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`PWA install outcome: ${outcome}`);
          deferredPrompt = null;
          installBtn.classList.add('hidden');
        });
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('Margdarshak AI app installed on device!');
      if (installBtn) installBtn.classList.add('hidden');
    });
  }

  // 1-Click WhatsApp & Social Viral Sharing Controller
  initSharing() {
    const shareModal = document.getElementById('shareModal');
    const closeShareBtn = document.getElementById('closeShareModalBtn');
    const openShareBtns = [
      document.getElementById('shareModalBtn'),
      document.getElementById('floatingShareBtn')
    ];

    openShareBtns.forEach(btn => {
      btn?.addEventListener('click', (e) => {
        e.preventDefault();
        this.openShareModal();
      });
    });

    closeShareBtn?.addEventListener('click', () => this.closeShareModal());
    shareModal?.addEventListener('click', (e) => {
      if (e.target === shareModal) this.closeShareModal();
    });

    // Configure URLs and share payloads
    const currentUrl = window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'https://margdarshak-ai.vercel.app';

    const shareLinkEl = document.getElementById('shareMessageLink');
    if (shareLinkEl) shareLinkEl.textContent = currentUrl;

    const shareMessage = `🎓 *Margdarshak AI* (SIH 2024 Edition) — Created by Mehak!
From Classroom to Dream Career — 100% Free for Tier-2 & Tier-3 students:
• 🎯 60+ Indian Tech companies Resume Gap Analyzer (TCS, Google, Infosys, Flipkart)
• 💰 25+ Verified Indian Scholarships + AI SOP Co-Pilot
• 🎙️ Live Voice AI Mock Interviewer with scorecard & feedback
⚡ Works superfast on 2G/3G low-bandwidth mobile internet!

Try it free here: ${currentUrl}`;

    // WhatsApp Button
    const waBtn = document.getElementById('btnShareWhatsApp');
    if (waBtn) {
      waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    }

    // LinkedIn Button
    const liBtn = document.getElementById('btnShareLinkedIn');
    if (liBtn) {
      liBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    }

    // Telegram Button
    const tgBtn = document.getElementById('btnShareTelegram');
    if (tgBtn) {
      tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent('Margdarshak AI — From Classroom to Dream Career (Created by Mehak)')}`;
    }

    // Copy Link Button
    const copyBtn = document.getElementById('btnCopyShareLink');
    const copyBtnText = document.getElementById('btnCopyShareLinkText');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentUrl).then(() => {
          if (copyBtnText) copyBtnText.textContent = "Copied to Clipboard! ✓";
          setTimeout(() => {
            if (copyBtnText) copyBtnText.textContent = "Copy Direct Platform Link";
          }, 2000);
          if (window.audioAssistant) window.audioAssistant.playClick();
        });
      });
    }
  }

  openShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.classList.remove('hidden');
    if (window.audioAssistant) window.audioAssistant.playClick();
    if (window.lucide) window.lucide.createIcons();
  }

  closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.classList.add('hidden');
  }

  // Google Gemini 1.5 Flash AI Settings Controller
  initGeminiSettings() {
    const geminiModal = document.getElementById('geminiSettingsModal');
    const openBtn = document.getElementById('geminiSettingsBtn');
    const closeBtn = document.getElementById('closeGeminiModalBtn');
    const saveBtn = document.getElementById('btnSaveGeminiKey');
    const clearBtn = document.getElementById('btnClearGeminiKey');
    const keyInput = document.getElementById('geminiApiKeyInput');
    const toggleVisBtn = document.getElementById('toggleGeminiKeyVisibilityBtn');
    const statusPill = document.getElementById('geminiActiveStatusPill');
    const notice = document.getElementById('geminiSaveNotice');

    // Prepopulate stored key
    const storedKey = localStorage.getItem('margdarshak_gemini_key') || '';
    if (keyInput) keyInput.value = storedKey;
    if (statusPill && storedKey) {
      statusPill.textContent = "Gemini 1.5 Flash Active";
      statusPill.className = "px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300";
    }

    openBtn?.addEventListener('click', () => this.openGeminiModal());
    closeBtn?.addEventListener('click', () => this.closeGeminiModal());
    geminiModal?.addEventListener('click', (e) => {
      if (e.target === geminiModal) this.closeGeminiModal();
    });

    // Toggle visibility
    toggleVisBtn?.addEventListener('click', () => {
      if (!keyInput) return;
      keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
    });

    // Save & Test Key
    saveBtn?.addEventListener('click', async () => {
      const key = (keyInput?.value || '').trim();
      if (!key) {
        if (notice) {
          notice.className = "p-3 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900";
          notice.textContent = "Please enter your Google Gemini API Key first.";
          notice.classList.remove('hidden');
        }
        return;
      }

      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span class="animate-spin mr-1">⏳</span> Validating...`;

      try {
        const userId = window.studentAuth?.getUserId() || 'usr_demo';
        const res = await fetch('/api/settings/api-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
          body: JSON.stringify({ apiKey: key })
        });

        const data = await res.json();
        localStorage.setItem('margdarshak_gemini_key', key);

        if (statusPill) {
          statusPill.textContent = "Gemini 1.5 Flash Connected";
          statusPill.className = "px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300";
        }

        if (notice) {
          notice.className = "p-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900";
          notice.textContent = "✓ Gemini 1.5 Flash API Key connected successfully!";
          notice.classList.remove('hidden');
        }

        if (window.audioAssistant) window.audioAssistant.playCelebration();
      } catch (err) {
        localStorage.setItem('margdarshak_gemini_key', key);
        if (notice) {
          notice.className = "p-3 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900";
          notice.textContent = "✓ Saved to browser storage (Offline Mode Active).";
          notice.classList.remove('hidden');
        }
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `Save & Test Key`;
      }
    });

    // Clear Key
    clearBtn?.addEventListener('click', () => {
      localStorage.removeItem('margdarshak_gemini_key');
      if (keyInput) keyInput.value = '';
      if (statusPill) {
        statusPill.textContent = "Hybrid Offline Ready";
        statusPill.className = "px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
      }
      if (notice) {
        notice.className = "p-3 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
        notice.textContent = "Reset to default built-in NLP engine.";
        notice.classList.remove('hidden');
      }
    });
  }

  openGeminiModal() {
    const modal = document.getElementById('geminiSettingsModal');
    if (modal) modal.classList.remove('hidden');
    if (window.audioAssistant) window.audioAssistant.playClick();
    if (window.lucide) window.lucide.createIcons();
  }

  closeGeminiModal() {
    const modal = document.getElementById('geminiSettingsModal');
    if (modal) modal.classList.add('hidden');
  }

  // Visual Confetti Effect on Accomplishment
  triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');

    const particles = [];
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 2,
        dx: (Math.random() - 0.5) * 12,
        dy: (Math.random() - 0.5) * 12 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        alpha: 1
      });
    }

    let frames = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.2; // gravity
        p.alpha -= 0.012;
        p.tiltAngle += p.tiltAngleIncremental;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fill();
      });

      frames++;
      if (frames < 90) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add('hidden');
      }
    };
    animate();
  }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.margdarshakApp = new MargdarshakApp();
  window.margdarshakApp.initPWA();
  window.margdarshakApp.initSharing();
  window.margdarshakApp.initGeminiSettings();
});
