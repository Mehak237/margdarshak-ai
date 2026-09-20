// Margdarshak AI - Killer Feature #2: Smart Scholarship Eligibility Engine & AI SOP Co-Pilot
// Multi-criteria filter engine matching 25+ Indian schemes, live instant search, 
// category pills, automated document checklist, and tailored committee-ready Statement of Purpose generator.

class ScholarshipEngine {
  constructor() {
    this.scholarships = [];
    this.selectedScholarshipForSOP = null;
    this.showOnlyEligible = true; // Default to showing only matching scholarships so filters dynamically update the view!
    this.searchQuery = '';
    this.activePill = 'all';
    this.init();
  }

  init() {
    this.loadData();
    this.bindEvents();
    this.filterScholarships();

    document.addEventListener('DOMContentLoaded', () => {
      this.loadData();
      this.filterScholarships();
    });
  }

  loadData() {
    if (window.scholarshipsData && window.scholarshipsData.length > 0) {
      this.scholarships = window.scholarshipsData;
    } else if (typeof scholarshipsData !== 'undefined' && scholarshipsData.length > 0) {
      this.scholarships = scholarshipsData;
      window.scholarshipsData = scholarshipsData;
    }
  }

  bindEvents() {
    // Filter controls
    const incomeSelect = document.getElementById('scholarshipIncomeFilter');
    const marksSlider = document.getElementById('scholarshipMarksSlider');
    const marksDisplay = document.getElementById('scholarshipMarksValue');
    const categorySelect = document.getElementById('scholarshipCategoryFilter');
    const genderSelect = document.getElementById('scholarshipGenderFilter');
    const stateSelect = document.getElementById('scholarshipStateFilter');
    const courseSelect = document.getElementById('scholarshipCourseFilter');
    const resetBtn = document.getElementById('scholarshipResetFilterBtn');
    const searchInput = document.getElementById('scholarshipSearchInput');

    // View toggle buttons
    const btnEligibleOnly = document.getElementById('btnScholarshipEligibleOnly');
    const btnShowAll = document.getElementById('btnScholarshipShowAll');

    if (marksSlider && marksDisplay) {
      marksSlider.addEventListener('input', (e) => {
        marksDisplay.textContent = `${e.target.value}%`;
        this.filterScholarships();
      });
    }

    [incomeSelect, categorySelect, genderSelect, stateSelect, courseSelect].forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
          this.filterScholarships();
          if (window.audioAssistant) window.audioAssistant.playClick();
        });
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.filterScholarships();
      });
    }

    // Category Quick Pills
    document.querySelectorAll('.scholarship-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scholarship-pill-btn').forEach(b => {
          b.classList.remove('active-pill', 'bg-emerald-600', 'text-white', 'border-emerald-600');
          b.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
        });
        btn.classList.add('active-pill', 'bg-emerald-600', 'text-white', 'border-emerald-600');
        btn.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
        this.activePill = btn.getAttribute('data-pill') || 'all';
        this.filterScholarships();
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    });

    // Eligible Only vs Show All toggle
    if (btnEligibleOnly) {
      btnEligibleOnly.addEventListener('click', () => {
        this.showOnlyEligible = true;
        btnEligibleOnly.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
        btnEligibleOnly.classList.remove('text-slate-600', 'dark:text-slate-400');
        if (btnShowAll) {
          btnShowAll.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
          btnShowAll.classList.add('text-slate-600', 'dark:text-slate-400');
        }
        this.filterScholarships();
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    }

    if (btnShowAll) {
      btnShowAll.addEventListener('click', () => {
        this.showOnlyEligible = false;
        btnShowAll.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');
        btnShowAll.classList.remove('text-slate-600', 'dark:text-slate-400');
        if (btnEligibleOnly) {
          btnEligibleOnly.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
          btnEligibleOnly.classList.add('text-slate-600', 'dark:text-slate-400');
        }
        this.filterScholarships();
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // SOP Generator controls
    const generateSOPBtn = document.getElementById('generateSOPBtn');
    const copySOPBtn = document.getElementById('copySOPBtn');
    const downloadSOPBtn = document.getElementById('downloadSOPBtn');
    const closeSOPModalBtn = document.getElementById('closeSOPModalBtn');

    if (generateSOPBtn) {
      generateSOPBtn.addEventListener('click', () => {
        this.generateTailoredSOP();
      });
    }

    if (copySOPBtn) {
      copySOPBtn.addEventListener('click', () => {
        const sopOutput = document.getElementById('generatedSOPText');
        if (sopOutput && sopOutput.value) {
          navigator.clipboard.writeText(sopOutput.value);
          copySOPBtn.textContent = "Copied to Clipboard! ✓";
          setTimeout(() => { copySOPBtn.textContent = "Copy to Clipboard"; }, 2000);
          if (window.audioAssistant) window.audioAssistant.playClick();
        }
      });
    }

    if (downloadSOPBtn) {
      downloadSOPBtn.addEventListener('click', () => {
        const sopOutput = document.getElementById('generatedSOPText');
        if (sopOutput && sopOutput.value) {
          const blob = new Blob([sopOutput.value], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const title = this.selectedScholarshipForSOP ? this.selectedScholarshipForSOP.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Scholarship';
          link.download = `SOP_${title}.txt`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          if (window.audioAssistant) window.audioAssistant.playClick();
        }
      });
    }

    if (closeSOPModalBtn) {
      closeSOPModalBtn.addEventListener('click', () => {
        const modal = document.getElementById('sopGeneratorModal');
        if (modal) modal.classList.add('hidden');
      });
    }
  }

  resetFilters() {
    const incomeSelect = document.getElementById('scholarshipIncomeFilter');
    const marksSlider = document.getElementById('scholarshipMarksSlider');
    const marksDisplay = document.getElementById('scholarshipMarksValue');
    const categorySelect = document.getElementById('scholarshipCategoryFilter');
    const genderSelect = document.getElementById('scholarshipGenderFilter');
    const stateSelect = document.getElementById('scholarshipStateFilter');
    const courseSelect = document.getElementById('scholarshipCourseFilter');
    const searchInput = document.getElementById('scholarshipSearchInput');

    if (incomeSelect) incomeSelect.value = "all";
    if (marksSlider) { marksSlider.value = 60; }
    if (marksDisplay) { marksDisplay.textContent = "60%"; }
    if (categorySelect) categorySelect.value = "all";
    if (genderSelect) genderSelect.value = "all";
    if (stateSelect) stateSelect.value = "all";
    if (courseSelect) courseSelect.value = "all";
    if (searchInput) searchInput.value = "";
    this.searchQuery = "";
    this.activePill = "all";

    document.querySelectorAll('.scholarship-pill-btn').forEach(b => {
      if (b.getAttribute('data-pill') === 'all') {
        b.classList.add('active-pill', 'bg-emerald-600', 'text-white', 'border-emerald-600');
        b.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300');
      } else {
        b.classList.remove('active-pill', 'bg-emerald-600', 'text-white', 'border-emerald-600');
        b.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-700', 'dark:text-slate-300');
      }
    });

    this.filterScholarships();
    if (window.audioAssistant) window.audioAssistant.playClick();
  }

  filterScholarships() {
    const incomeVal = document.getElementById('scholarshipIncomeFilter')?.value || 'all';
    const marksVal = parseInt(document.getElementById('scholarshipMarksSlider')?.value || '60', 10);
    const categoryVal = document.getElementById('scholarshipCategoryFilter')?.value || 'all';
    const genderVal = document.getElementById('scholarshipGenderFilter')?.value || 'all';
    const stateVal = document.getElementById('scholarshipStateFilter')?.value || 'all';
    const courseVal = document.getElementById('scholarshipCourseFilter')?.value || 'all';

    // Update active filter summary badge
    const summaryPill = document.getElementById('activeFiltersSummaryPill');
    if (summaryPill) {
      const activeParts = [];
      if (genderVal !== 'all') activeParts.push(genderVal);
      if (categoryVal !== 'all') activeParts.push(categoryVal);
      if (stateVal !== 'all') activeParts.push(stateVal);
      if (courseVal !== 'all') activeParts.push(courseVal);
      if (incomeVal !== 'all') activeParts.push(`Income < ₹${(parseInt(incomeVal)/100000).toFixed(1)}L`);
      if (marksVal > 60) activeParts.push(`Marks: ${marksVal}%`);
      summaryPill.textContent = activeParts.length ? `Filters active: ${activeParts.join(' • ')}` : 'Showing all criteria';
    }

    const results = [];

    for (const sch of this.scholarships) {
      let eligible = true;
      let reasons = [];

      // Keyword Search Filter
      if (this.searchQuery) {
        const text = `${sch.name} ${sch.provider} ${sch.description} ${sch.category.join(' ')} ${sch.states.join(' ')}`.toLowerCase();
        if (!text.includes(this.searchQuery)) {
          continue; // completely skip if keyword search doesn't match
        }
      }

      // Quick Pill Filter
      if (this.activePill === 'female' && sch.gender !== 'Female') continue;
      if (this.activePill === 'central') {
        const p = sch.provider.toLowerCase();
        if (!p.includes('govt') && !p.includes('ministry') && !p.includes('aicte') && !p.includes('central')) continue;
      }
      if (this.activePill === 'csr') {
        const p = `${sch.provider} ${sch.name}`.toLowerCase();
        if (!p.includes('foundation') && !p.includes('trust') && !p.includes('tata') && !p.includes('reliance') && !p.includes('hdfc') && !p.includes('wipro') && !p.includes('siemens') && !p.includes('birla')) continue;
      }
      if (this.activePill === 'state') {
        if (sch.states.includes('All')) continue;
      }
      if (this.activePill === 'tech') {
        if (!sch.eligibleCourses.includes('B.Tech/BE')) continue;
      }

      // Income check
      if (incomeVal !== 'all') {
        const incomeNum = parseInt(incomeVal, 10);
        if (incomeNum > sch.maxIncome) {
          eligible = false;
          reasons.push(`Family income exceeds ceiling of ₹${(sch.maxIncome / 100000).toFixed(1)} LPA`);
        }
      }

      // Marks percentage check
      if (marksVal < sch.minPercentage) {
        eligible = false;
        reasons.push(`Requires minimum ${sch.minPercentage}% marks (current: ${marksVal}%)`);
      }

      // Category check
      if (categoryVal !== 'all') {
        if (!sch.category.includes(categoryVal)) {
          eligible = false;
          reasons.push(`Reserved for ${sch.category.join(', ')} categories`);
        }
      }

      // Gender check
      if (genderVal !== 'all') {
        if (sch.gender !== 'Any' && sch.gender !== genderVal) {
          eligible = false;
          reasons.push(`Reserved exclusively for ${sch.gender} applicants`);
        }
      }

      // State check
      if (stateVal !== 'all') {
        if (!sch.states.includes('All') && !sch.states.includes(stateVal)) {
          eligible = false;
          reasons.push(`Specific to residents of ${sch.states.join(', ')}`);
        }
      }

      // Course check
      if (courseVal !== 'all') {
        if (!sch.eligibleCourses.includes(courseVal)) {
          eligible = false;
          reasons.push(`Applicable for ${sch.eligibleCourses.join(', ')}`);
        }
      }

      results.push({
        ...sch,
        isEligible: eligible,
        reasons: reasons
      });
    }

    this.renderScholarshipCards(results);
  }

  renderScholarshipCards(list) {
    const container = document.getElementById('scholarshipCardsContainer');
    const countBadge = document.getElementById('eligibleScholarshipsCountBadge');
    const heading = document.getElementById('scholarshipResultsHeading');
    if (!container) return;

    // Filter by mode: Eligible only vs Show all
    let displayList = list;
    if (this.showOnlyEligible) {
      displayList = list.filter(s => s.isEligible);
      if (heading) heading.textContent = "100% Eligible Scholarships For You";
    } else {
      if (heading) heading.textContent = "All Indian Schemes (Eligibility Status)";
    }

    // Sort: Eligible first, then by award amount numeric descending
    displayList.sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.amountNumeric - a.amountNumeric;
    });

    const eligibleCount = list.filter(s => s.isEligible).length;
    if (countBadge) {
      if (this.showOnlyEligible) {
        countBadge.textContent = `${displayList.length} Matching Schemes`;
      } else {
        countBadge.textContent = `${eligibleCount} of ${list.length} Eligible`;
      }
    }

    if (displayList.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 px-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-center space-y-4">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-sm">
            🔍
          </div>
          <div class="max-w-md mx-auto space-y-1.5">
            <h4 class="text-base font-bold text-slate-900 dark:text-white">No Matching Scholarships for These Exact Criteria</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Try adjusting your filters (e.g. set Annual Family Income to 'Any' or choose 'All India' states), or switch to 'All Schemes' to see all requirements.
            </p>
          </div>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button onclick="window.scholarshipEngine.resetFilters()" class="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer">
              🔄 Reset All Filters
            </button>
            <button onclick="document.getElementById('btnScholarshipShowAll')?.click()" class="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              🌐 View All 25+ Schemes
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = displayList.map(item => `
      <div class="scholarship-card relative rounded-3xl border transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between ${
        item.isEligible 
          ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-300/80 dark:border-emerald-800/80 shadow-md hover:shadow-xl hover:border-emerald-500' 
          : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
      }">
        <div>
          <!-- Status Pill & Deadline -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              item.isEligible 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/60'
            }">
              ${item.isEligible 
                ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg> 100% Eligible' 
                : '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg> Gap Identified'}
            </span>
            <div class="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              <span>📅 ${item.deadline}</span>
            </div>
          </div>

          <!-- Scholarship Name -->
          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
            ${item.name}
          </h3>
          <p class="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
            ${item.provider}
          </p>

          <!-- Award Amount Highlight -->
          <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 dark:from-emerald-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-emerald-200/60 dark:border-emerald-800/40 mb-3.5">
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Award Amount / Grant</div>
            <div class="text-lg font-black text-emerald-600 dark:text-emerald-400 font-display">
              ${item.awardAmount}
            </div>
          </div>

          <!-- Criteria Tags -->
          <div class="flex flex-wrap gap-1.5 mb-3 text-[11px] font-semibold">
            <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Min: ${item.minPercentage}%</span>
            <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Max Income: ₹${(item.maxIncome / 100000).toFixed(1)}L</span>
            <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${item.gender === 'Any' ? 'All Genders' : 'Girls Only'}</span>
            <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${item.states.includes('All') ? 'All India' : item.states.join(', ')}</span>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            ${item.description}
          </p>

          <!-- Gap reasons if not eligible -->
          ${!item.isEligible && item.reasons.length ? `
            <div class="mb-3.5 p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-400">
              <strong class="font-bold">Eligibility Gap:</strong> ${item.reasons.join('; ')}
            </div>
          ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button class="btn-open-sop flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer" data-sch-id="${item.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            <span>Write SOP with AI</span>
          </button>
          
          <button class="btn-save-scholarship p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="Save to Dashboard" data-sch-id="${item.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          </button>

          <a href="${item.officialPortal}" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Official Application Portal">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
    `).join('');

    // Attach click events
    container.querySelectorAll('.btn-open-sop').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-sch-id');
        this.openSOPModal(id);
      });
    });

    container.querySelectorAll('.btn-save-scholarship').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-sch-id');
        this.saveScholarshipToDashboard(id, btn);
      });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  saveScholarshipToDashboard(id, btn) {
    const sch = this.scholarships.find(s => s.id === id);
    if (!sch) return;

    try {
      const existing = JSON.parse(localStorage.getItem('margdarshak_saved_scholarships') || '[]');
      if (!existing.some(s => s.id === sch.id)) {
        existing.push({
          id: sch.id,
          name: sch.name,
          provider: sch.provider,
          amount: sch.awardAmount,
          deadline: sch.deadline,
          status: "Saved",
          dateSaved: new Date().toLocaleDateString('en-IN')
        });
        localStorage.setItem('margdarshak_saved_scholarships', JSON.stringify(existing));

        // Cloud DB Sync (Multi-User)
        const userId = window.studentAuth?.getUserId() || 'usr_demo';
        fetch('/api/scholarships/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
          body: JSON.stringify({
            scholarshipId: sch.id,
            title: sch.name,
            amount: sch.awardAmount
          })
        }).catch(err => console.warn("Cloud DB scholarship save note (offline fallback):", err));

        if (btn) {
          btn.classList.add('bg-emerald-100', 'text-emerald-700', 'border-emerald-300');
          btn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`;
        }
        if (window.audioAssistant) window.audioAssistant.playClick();
        if (window.studentDashboard) window.studentDashboard.loadDashboardData();
      } else {
        alert("This scholarship is already saved in your Student Dashboard!");
      }
    } catch (e) {
      console.warn("Save scholarship error", e);
    }
  }

  openSOPModal(id) {
    const sch = this.scholarships.find(s => s.id === id);
    if (!sch) return;
    this.selectedScholarshipForSOP = sch;

    const modal = document.getElementById('sopGeneratorModal');
    const title = document.getElementById('sopModalScholarshipTitle');
    const tipsBox = document.getElementById('sopModalTipsText');

    if (title) title.textContent = sch.name;
    if (tipsBox) tipsBox.textContent = sch.sopTips || "Focus on your academic passion and socio-economic resilience.";

    if (modal) {
      modal.classList.remove('hidden');
      if (window.audioAssistant) window.audioAssistant.playClick();
    }
  }

  generateTailoredSOP() {
    const sch = this.selectedScholarshipForSOP;
    if (!sch) return;

    const bgText = document.getElementById('sopBackgroundInput')?.value.trim() || "Coming from an agricultural household with modest annual means, I am the first in my extended family to pursue a professional engineering degree.";
    const achText = document.getElementById('sopAchievementInput')?.value.trim() || "Consistent academic standing with distinction; engineered a solar-assisted irrigation telemetry project addressing local agrarian challenges.";
    const visionText = document.getElementById('sopVisionInput')?.value.trim() || "Aspire to master scalable software systems and artificial intelligence, dedicated to mentoring rural underprivileged youth and driving national digital self-reliance.";
    const tone = document.getElementById('sopToneSelector')?.value || "formal";

    const outputTextarea = document.getElementById('generatedSOPText');
    const container = document.getElementById('sopOutputContainer');

    // Generate tailored letter
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    
    let sop = `STATEMENT OF PURPOSE & MOTIVATION LETTER\n`;
    sop += `Target Scheme: ${sch.name}\n`;
    sop += `Awarding Body: ${sch.provider}\n`;
    sop += `Date: ${dateStr}\n\n`;
    sop += `To,\nThe Selection & Grant Committee,\n${sch.provider},\nIndia.\n\n`;
    sop += `Subject: Application for ${sch.name} — Statement of Purpose\n\n`;
    sop += `Respected Members of the Committee,\n\n`;
    
    sop += `I am writing to respectfully submit my candidature for the esteemed ${sch.name}. As a dedicated undergraduate student pursuing higher technical education in India, receiving this grant would provide the indispensable financial and institutional foundation required to achieve my educational and societal objectives without the compounding burden of economic distress.\n\n`;
    
    sop += `1. Family Background & Financial Imperative:\n${bgText} Economic constraints have frequently presented systemic barriers in my academic journey; however, these circumstances have also instilled within me an unwavering work ethic, resilience, and appreciation for the transformative potential of higher education. This scholarship will alleviate tuition obligations, allowing me to channel my complete focus into rigorous academic research, lab work, and professional development.\n\n`;

    sop += `2. Academic Trajectory & Technical Initiatives:\n${achText} Throughout my schooling and collegiate tenure, I have maintained high academic standards while continually seeking opportunities to translate theoretical engineering paradigms into tangible community solutions. My coursework and hands-on projects reflect my conviction that technology must be harnessed to solve ground-level socioeconomic problems.\n\n`;

    sop += `3. Career Vision & Commitment to Community Give-Back:\n${visionText} Looking forward, I am determined to establish myself as a responsible technologist contributing to India's burgeoning digital infrastructure. I believe strongly that privilege carries responsibility. Upon completing my graduation and securing a professional foothold, I am pledged to establish mentorship programs for students from Tier-2 and Tier-3 rural institutions, helping subsequent generations transcend educational inequality.\n\n`;

    sop += `I affirm that all details submitted in this dossier are true to the best of my knowledge. I humbly request the committee to favorably consider my application and grant me the opportunity to uphold the distinguished values of ${sch.provider}.\n\n`;
    sop += `Yours sincerely,\nCandidate Name\nContact: +91-XXXXXXXXXX | Email: applicant@margdarshak.edu.in`;

    if (outputTextarea) {
      outputTextarea.value = sop;
    }
    if (container) {
      container.classList.remove('hidden');
      container.scrollIntoView({ behavior: 'smooth' });
    }

    if (window.audioAssistant) {
      window.audioAssistant.playCelebration();
    }
  }
}

// Global initialization
window.scholarshipEngine = new ScholarshipEngine();
