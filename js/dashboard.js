// Margdarshak AI - Student Command Dashboard
// Aggregates saved scholarships, resume scans, and mock interview test scorecards.

class StudentDashboard {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadDashboardData();
  }

  bindEvents() {
    const clearDataBtn = document.getElementById('clearDashboardDataBtn');
    if (clearDataBtn) {
      clearDataBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset your saved dashboard history?")) {
          localStorage.removeItem('margdarshak_saved_scholarships');
          localStorage.removeItem('margdarshak_resume_scans');
          localStorage.removeItem('margdarshak_mock_history');
          localStorage.removeItem('margdarshak_current_target');
          this.loadDashboardData();
          if (window.audioAssistant) window.audioAssistant.playClick();
        }
      });
    }

    // Tab switcher inside dashboard if present
    const tabs = document.querySelectorAll('.dashboard-subtab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-subtab');
        tabs.forEach(t => t.classList.remove('active', 'border-indigo-600', 'text-indigo-600', 'dark:text-indigo-400'));
        tab.classList.add('active', 'border-indigo-600', 'text-indigo-600', 'dark:text-indigo-400');

        document.querySelectorAll('.dashboard-subtab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`subtab-${target}`)?.classList.remove('hidden');
      });
    });
  }

  async loadDashboardData() {
    // 1. Fetch multi-user Cloud DB records
    const userId = window.studentAuth?.getUserId() || 'usr_demo';
    try {
      const apiRes = await fetch(`/api/dashboard?userId=${encodeURIComponent(userId)}`, {
        headers: { 'x-user-id': userId }
      });
      if (apiRes.ok) {
        const serverData = await apiRes.json();
        if (serverData.user) {
          const targetObj = {
            company: serverData.user.targetCompany || "Tata Consultancy Services (TCS)",
            role: serverData.user.targetRole || "Systems Engineer (Prime / 9 LPA)",
            score: serverData.user.readinessScore || 75
          };
          localStorage.setItem('margdarshak_current_target', JSON.stringify(targetObj));
        }
        if (serverData.resumeScans && serverData.resumeScans.length > 0) {
          localStorage.setItem('margdarshak_resume_scans', JSON.stringify(serverData.resumeScans));
        }
        if (serverData.savedScholarships && serverData.savedScholarships.length > 0) {
          localStorage.setItem('margdarshak_saved_scholarships', JSON.stringify(serverData.savedScholarships));
        }
        if (serverData.mockInterviews && serverData.mockInterviews.length > 0) {
          localStorage.setItem('margdarshak_mock_history', JSON.stringify(serverData.mockInterviews));
        }
      }
    } catch (err) {
      // Offline fallback
      console.log("Dashboard operating in offline storage mode");
    }

    // 2. Target & Readiness
    const targetObj = JSON.parse(localStorage.getItem('margdarshak_current_target') || 'null');
    const scans = JSON.parse(localStorage.getItem('margdarshak_resume_scans') || '[]');
    const mocks = JSON.parse(localStorage.getItem('margdarshak_mock_history') || '[]');
    const scholarships = JSON.parse(localStorage.getItem('margdarshak_saved_scholarships') || '[]');

    const targetCompanyEl = document.getElementById('dashStatTargetCompany');
    const targetRoleEl = document.getElementById('dashStatTargetRole');
    const readinessScoreEl = document.getElementById('dashStatReadinessScore');
    const savedSchCountEl = document.getElementById('dashStatSavedSchCount');
    const mocksCountEl = document.getElementById('dashStatMocksCount');

    if (targetObj) {
      if (targetCompanyEl) targetCompanyEl.textContent = targetObj.company;
      if (targetRoleEl) targetRoleEl.textContent = targetObj.role;
    } else {
      if (targetCompanyEl) targetCompanyEl.textContent = "TCS Prime / Amazon SDE-1";
      if (targetRoleEl) targetRoleEl.textContent = "Target Role Not Set";
    }

    // Compute readiness score
    let readiness = 65;
    if (scans.length > 0) {
      readiness = scans[0].score;
    }
    if (mocks.length > 0) {
      const avgMock = parseFloat(mocks[0].overallRating) * 10;
      readiness = Math.round((readiness * 0.6) + (avgMock * 0.4));
    }
    if (readinessScoreEl) {
      readinessScoreEl.textContent = `${readiness}%`;
    }

    if (savedSchCountEl) savedSchCountEl.textContent = scholarships.length;
    if (mocksCountEl) mocksCountEl.textContent = mocks.length;

    // Render lists
    this.renderSavedScholarships(scholarships);
    this.renderResumeScans(scans);
    this.renderMockHistory(mocks);
  }

  renderSavedScholarships(list) {
    const container = document.getElementById('dashSavedScholarshipsList');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
          No scholarships bookmarked yet. Explore 25+ verified schemes in the Scholarships tab!
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead class="bg-slate-50 dark:bg-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            <tr>
              <th class="px-4 py-3">Scholarship Name</th>
              <th class="px-4 py-3">Grant Amount</th>
              <th class="px-4 py-3">Deadline</th>
              <th class="px-4 py-3">Application Status</th>
              <th class="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${list.map((item, index) => `
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                  ${item.name}
                  <div class="text-[10px] text-slate-400 font-normal">${item.provider}</div>
                </td>
                <td class="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">${item.amount}</td>
                <td class="px-4 py-3">${item.deadline}</td>
                <td class="px-4 py-3">
                  <select class="sch-status-select text-[11px] py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium" data-index="${index}">
                    <option value="Saved" ${item.status === 'Saved' ? 'selected' : ''}>📌 Bookmarked</option>
                    <option value="Applied" ${item.status === 'Applied' ? 'selected' : ''}>📝 Applied</option>
                    <option value="Shortlisted" ${item.status === 'Shortlisted' ? 'selected' : ''}>🎉 Shortlisted</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-right">
                  <button class="sch-delete-btn text-rose-500 hover:text-rose-700 p-1 font-bold" data-index="${index}" title="Remove">✕</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('.sch-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const idx = e.target.getAttribute('data-index');
        list[idx].status = e.target.value;
        localStorage.setItem('margdarshak_saved_scholarships', JSON.stringify(list));
      });
    });

    container.querySelectorAll('.sch-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = btn.getAttribute('data-index');
        list.splice(idx, 1);
        localStorage.setItem('margdarshak_saved_scholarships', JSON.stringify(list));
        this.loadDashboardData();
      });
    });
  }

  renderResumeScans(list) {
    const container = document.getElementById('dashResumeScansList');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
          No resume gap scans recorded yet. Upload your resume in the Gap Analyzer to get started!
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        ${list.map(scan => `
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">${scan.company} — ${scan.role}</div>
              <div class="text-xs text-slate-500 mt-0.5">Scanned on ${scan.date} • ${scan.package}</div>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">${scan.matchedSkills.length} Skills Matched</span>
                <span class="text-[11px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">${scan.missingSkills.length} Skills Missing</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400">${scan.score}%</div>
              <div class="text-[10px] uppercase font-bold text-slate-400">Match Score</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderMockHistory(list) {
    const container = document.getElementById('dashMockHistoryList');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
          No mock tests taken yet. Start an interview in the AI Mock Interviewer tab!
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        ${list.map(mock => `
          <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">${mock.company} • ${mock.role}</div>
              <div class="text-xs text-slate-500 mt-0.5">Session Date: ${mock.date}</div>
              <div class="mt-1.5">
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold border ${mock.verdictColor}">${mock.verdict}</span>
              </div>
            </div>
            <div class="text-right flex items-center gap-4">
              <div>
                <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${mock.overallRating}/10</div>
                <div class="text-[10px] uppercase font-bold text-slate-400">Overall Rating</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Global initialization
window.studentDashboard = new StudentDashboard();
