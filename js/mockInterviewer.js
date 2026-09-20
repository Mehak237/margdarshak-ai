// Margdarshak AI - Killer Feature #3: Interactive AI Mock Interviewer with Live Scorecard
// Voice speech synthesis, speech recognition, randomized 5-7 questions per role,
// live hint coach, real-time response analysis, and comprehensive scorecard.

class MockInterviewer {
  constructor() {
    this.currentRole = null;
    this.sessionQuestions = [];
    this.currentIndex = 0;
    this.userAnswers = [];
    this.timerInterval = null;
    this.timeSeconds = 180; // 3 minutes per question
    this.isRecording = false;
    this.init();
  }

  init() {
    this.populateCompanyRoleDropdowns();
    this.bindEvents();
  }

  populateCompanyRoleDropdowns() {
    const compSelect = document.getElementById('mockCompanySelect');
    const roleSelect = document.getElementById('mockRoleSelect');
    if (!compSelect || !roleSelect || !window.companiesData) return;

    // Populate companies
    compSelect.innerHTML = window.companiesData.map(c => `
      <option value="${c.id}">${c.name} (${c.tier})</option>
    `).join('');

    const updateRoles = () => {
      const selectedCompId = compSelect.value;
      const comp = window.companiesData.find(c => c.id === selectedCompId);
      if (comp) {
        roleSelect.innerHTML = comp.roles.map(r => `
          <option value="${r.roleId}">${r.title} — ${r.package}</option>
        `).join('');
      }
    };

    compSelect.addEventListener('change', updateRoles);
    updateRoles();
  }

  bindEvents() {
    const startBtn = document.getElementById('startMockInterviewBtn');
    const listenBtn = document.getElementById('listenQuestionBtn');
    const micBtn = document.getElementById('micToggleBtn');
    const hintBtn = document.getElementById('askHintBtn');
    const submitBtn = document.getElementById('submitMockAnswerBtn');
    const retakeBtn = document.getElementById('retakeInterviewBtn');
    const saveScorecardBtn = document.getElementById('saveScorecardToDashboardBtn');
    const answerInput = document.getElementById('mockAnswerInput');

    if (startBtn) {
      startBtn.addEventListener('click', () => this.startNewSession());
    }

    if (listenBtn) {
      listenBtn.addEventListener('click', () => {
        const q = this.sessionQuestions[this.currentIndex];
        if (q && window.audioAssistant) {
          window.audioAssistant.speak(q.question);
        }
      });
    }

    if (micBtn) {
      micBtn.addEventListener('click', () => this.toggleVoiceInput());
    }

    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.revealHint());
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitAnswerAndNext());
    }

    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        const setup = document.getElementById('mockSetupCard');
        const room = document.getElementById('mockInterviewRoom');
        const card = document.getElementById('mockScorecardView');
        if (setup) setup.classList.remove('hidden');
        if (room) room.classList.add('hidden');
        if (card) card.classList.add('hidden');
        if (window.audioAssistant) window.audioAssistant.playClick();
      });
    }

    if (saveScorecardBtn) {
      saveScorecardBtn.addEventListener('click', () => this.saveScorecardToStorage());
    }

    if (answerInput) {
      answerInput.addEventListener('input', (e) => {
        const wordCountDisplay = document.getElementById('mockAnswerWordCount');
        const words = e.target.value.trim().split(/\s+/).filter(Boolean).length;
        if (wordCountDisplay) {
          wordCountDisplay.textContent = `${words} words`;
        }
      });
    }
  }

  startNewSession() {
    const compSelect = document.getElementById('mockCompanySelect');
    const roleSelect = document.getElementById('mockRoleSelect');
    if (!compSelect || !roleSelect) return;

    const compId = compSelect.value;
    const roleId = roleSelect.value;

    const comp = window.companiesData.find(c => c.id === compId);
    const role = comp ? comp.roles.find(r => r.roleId === roleId) : null;

    if (!role) {
      alert("Please select a target company and role.");
      return;
    }

    this.currentRole = {
      companyName: comp.name,
      roleId: role.roleId,
      title: role.title,
      package: role.package,
      category: role.category
    };

    // Generate 5-6 randomized questions
    if (window.generateInterviewQuestions) {
      this.sessionQuestions = window.generateInterviewQuestions(role.roleId, comp.name, role.title);
    } else {
      this.sessionQuestions = window.universalQuestions || [];
    }

    this.currentIndex = 0;
    this.userAnswers = [];

    // Switch view
    document.getElementById('mockSetupCard')?.classList.add('hidden');
    document.getElementById('mockInterviewRoom')?.classList.remove('hidden');
    document.getElementById('mockScorecardView')?.classList.add('hidden');

    // Update panel header
    const panelTitle = document.getElementById('mockPanelRoleTitle');
    if (panelTitle) {
      panelTitle.textContent = `${comp.name} • ${role.title} Technical Interview`;
    }

    if (window.audioAssistant) {
      window.audioAssistant.playNextChime();
    }

    this.loadQuestion(0);
  }

  loadQuestion(index) {
    if (index >= this.sessionQuestions.length) {
      this.finishInterview();
      return;
    }

    this.currentIndex = index;
    const q = this.sessionQuestions[index];

    // Reset UI fields
    const qNumber = document.getElementById('mockCurrentQNumber');
    const qTotal = document.getElementById('mockTotalQCount');
    const qCategory = document.getElementById('mockQuestionCategory');
    const qText = document.getElementById('mockQuestionText');
    const hintBox = document.getElementById('mockHintBox');
    const answerInput = document.getElementById('mockAnswerInput');
    const wordCountDisplay = document.getElementById('mockAnswerWordCount');

    if (qNumber) qNumber.textContent = index + 1;
    if (qTotal) qTotal.textContent = this.sessionQuestions.length;
    if (qCategory) qCategory.textContent = q.category || "Technical Evaluation";
    if (qText) qText.textContent = q.question;
    if (hintBox) hintBox.classList.add('hidden');
    if (answerInput) {
      answerInput.value = "";
      answerInput.focus();
    }
    if (wordCountDisplay) wordCountDisplay.textContent = "0 words";

    // Start timer
    this.startTimer(180);

    // Speak question automatically
    if (window.audioAssistant) {
      window.audioAssistant.speak(q.question);
    }
  }

  startTimer(seconds) {
    clearInterval(this.timerInterval);
    this.timeSeconds = seconds;
    const timerDisplay = document.getElementById('mockTimerDisplay');

    const updateUI = () => {
      const mins = Math.floor(this.timeSeconds / 60);
      const secs = this.timeSeconds % 60;
      if (timerDisplay) {
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (this.timeSeconds < 30) {
          timerDisplay.classList.add('text-rose-500', 'animate-pulse');
        } else {
          timerDisplay.classList.remove('text-rose-500', 'animate-pulse');
        }
      }
    };

    updateUI();
    this.timerInterval = setInterval(() => {
      this.timeSeconds--;
      if (this.timeSeconds <= 0) {
        clearInterval(this.timerInterval);
        // Prompt user time is up
      }
      updateUI();
    }, 1000);
  }

  revealHint() {
    const q = this.sessionQuestions[this.currentIndex];
    const hintBox = document.getElementById('mockHintBox');
    const hintText = document.getElementById('mockHintText');
    if (hintBox && hintText && q) {
      hintText.textContent = q.hint || "Think about time/space trade-offs and structural modularity.";
      hintBox.classList.remove('hidden');
      if (window.audioAssistant) window.audioAssistant.playClick();
    }
  }

  toggleVoiceInput() {
    const micBtn = document.getElementById('micToggleBtn');
    const answerInput = document.getElementById('mockAnswerInput');
    const micStatus = document.getElementById('micStatusText');

    if (!this.isRecording) {
      const started = window.audioAssistant.startListening((transcript, isFinal) => {
        if (answerInput) {
          answerInput.value = transcript;
          const words = transcript.trim().split(/\s+/).filter(Boolean).length;
          const wordCountDisplay = document.getElementById('mockAnswerWordCount');
          if (wordCountDisplay) wordCountDisplay.textContent = `${words} words`;
        }
      });

      if (started) {
        this.isRecording = true;
        if (micBtn) micBtn.classList.add('bg-rose-500', 'text-white', 'animate-pulse');
        if (micStatus) micStatus.textContent = "Listening... Speak into microphone";
      } else {
        alert("Microphone access is not supported or was blocked. You can type your response directly in the answer box.");
      }
    } else {
      window.audioAssistant.stopListening();
      this.isRecording = false;
      if (micBtn) micBtn.classList.remove('bg-rose-500', 'text-white', 'animate-pulse');
      if (micStatus) micStatus.textContent = "Voice Input";
    }
  }

  submitAnswerAndNext() {
    const answerInput = document.getElementById('mockAnswerInput');
    const ans = answerInput ? answerInput.value.trim() : "";

    if (!ans && this.timeSeconds > 10) {
      const confirmSkip = confirm("Your answer is blank. Would you like to submit an empty response, or would you like a moment to type your answer?");
      if (!confirmSkip) return;
    }

    // Stop recording if active
    if (this.isRecording) {
      this.toggleVoiceInput();
    }

    const q = this.sessionQuestions[this.currentIndex];
    this.userAnswers.push({
      question: q.question,
      category: q.category,
      type: q.type,
      userAnswer: ans || "[No response recorded]",
      idealAnswer: q.idealAnswer,
      mistakesToAvoid: q.mistakesToAvoid,
      keywords: q.keywords || []
    });

    if (window.audioAssistant) {
      window.audioAssistant.playNextChime();
    }

    this.loadQuestion(this.currentIndex + 1);
  }

  finishInterview() {
    clearInterval(this.timerInterval);
    if (window.audioAssistant) {
      window.audioAssistant.stopSpeaking();
      window.audioAssistant.playCelebration();
    }

    // Compute detailed scorecard
    const scorecard = this.evaluateInterviewSession();

    // Render scorecard
    this.renderScorecard(scorecard);

    // Switch view
    document.getElementById('mockInterviewRoom')?.classList.add('hidden');
    document.getElementById('mockScorecardView')?.classList.remove('hidden');
  }

  evaluateInterviewSession() {
    let totalTechScore = 0;
    let totalArtScore = 0;
    let totalProbScore = 0;
    const questionEvaluations = [];

    this.userAnswers.forEach((item, idx) => {
      const text = item.userAnswer.toLowerCase();
      const words = item.userAnswer.split(/\s+/).filter(Boolean).length;
      let matchedKwCount = 0;

      item.keywords.forEach(kw => {
        if (text.includes(kw.toLowerCase())) {
          matchedKwCount++;
        }
      });

      // Question-level metrics
      let qTech = 4;
      let qArt = 4;
      let strengths = [];
      let mistakes = [];

      // Articulation checks
      if (words >= 35 && words <= 160) {
        qArt += 3;
        strengths.push("Well-structured, concise response length.");
      } else if (words < 35) {
        mistakes.push("Answer lacked depth and explanation detail.");
      } else {
        qArt += 1.5;
        mistakes.push("Slightly unstructured or rambling; strive for crisp STAR format.");
      }

      // Keyword & technical depth checks
      if (matchedKwCount >= 3) {
        qTech += 4.5;
        strengths.push(`Mentioned core architecture concepts: ${item.keywords.slice(0, 3).join(', ')}.`);
      } else if (matchedKwCount >= 1) {
        qTech += 2.5;
        strengths.push("Recognized foundational principles.");
        mistakes.push(`Missed critical terminology: ${item.keywords.slice(1, 4).join(', ')}.`);
      } else {
        mistakes.push(`Failed to address technical core keywords: ${item.keywords.slice(0, 3).join(', ')}.`);
      }

      // Append default critique from question data
      if (item.mistakesToAvoid) {
        mistakes.push(`Watch out: ${item.mistakesToAvoid}`);
      }

      if (qTech > 10) qTech = 10;
      if (qArt > 10) qArt = 10;

      totalTechScore += qTech;
      totalArtScore += qArt;
      totalProbScore += (qTech * 0.6 + qArt * 0.4);

      questionEvaluations.push({
        qIndex: idx + 1,
        question: item.question,
        category: item.category,
        userAnswer: item.userAnswer,
        idealAnswer: item.idealAnswer,
        techScore: qTech.toFixed(1),
        artScore: qArt.toFixed(1),
        strengths: strengths,
        mistakes: mistakes
      });
    });

    const count = this.userAnswers.length || 1;
    const avgTech = (totalTechScore / count).toFixed(1);
    const avgArt = (totalArtScore / count).toFixed(1);
    const avgProb = (totalProbScore / count).toFixed(1);
    const overallRating = ((parseFloat(avgTech) * 0.5) + (parseFloat(avgArt) * 0.3) + (parseFloat(avgProb) * 0.2)).toFixed(1);

    let verdict = "Strong Hire — Top 5% Readiness!";
    let verdictColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300";
    if (overallRating < 6.0) {
      verdict = "Needs 2 Weeks Focused Preparation";
      verdictColor = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300";
    } else if (overallRating < 7.8) {
      verdict = "Conditional Hire — Brush Up Edge Cases";
      verdictColor = "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300";
    }

    return {
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      company: this.currentRole.companyName,
      role: this.currentRole.title,
      package: this.currentRole.package,
      overallRating: overallRating,
      avgTech: avgTech,
      avgArt: avgArt,
      avgProb: avgProb,
      verdict: verdict,
      verdictColor: verdictColor,
      questions: questionEvaluations
    };
  }

  renderScorecard(scorecard) {
    this.latestScorecard = scorecard;

    const roleHeading = document.getElementById('scorecardRoleHeading');
    const verdictBadge = document.getElementById('scorecardVerdictBadge');
    const techScoreEl = document.getElementById('scorecardTechScore');
    const artScoreEl = document.getElementById('scorecardArtScore');
    const probScoreEl = document.getElementById('scorecardProbScore');
    const overallScoreEl = document.getElementById('scorecardOverallScore');
    const qListContainer = document.getElementById('scorecardQuestionsList');

    if (roleHeading) roleHeading.textContent = `${scorecard.company} • ${scorecard.role}`;
    if (verdictBadge) {
      verdictBadge.textContent = scorecard.verdict;
      verdictBadge.className = `px-3.5 py-1 rounded-full text-xs font-bold border ${scorecard.verdictColor}`;
    }
    if (overallScoreEl) overallScoreEl.textContent = `${scorecard.overallRating} / 10`;
    if (techScoreEl) techScoreEl.textContent = `${scorecard.avgTech} / 10`;
    if (artScoreEl) artScoreEl.textContent = `${scorecard.avgArt} / 10`;
    if (probScoreEl) probScoreEl.textContent = `${scorecard.avgProb} / 10`;

    if (qListContainer) {
      qListContainer.innerHTML = scorecard.questions.map(q => `
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 mr-2">Q${q.qIndex}: ${q.category}</span>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white inline">${q.question}</h4>
            </div>
            <div class="text-right text-xs font-bold whitespace-nowrap text-indigo-600 dark:text-indigo-400">
              Tech: ${q.techScore}/10
            </div>
          </div>

          <!-- Student Answer -->
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
            <div class="font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider text-[10px]">Your Response:</div>
            <p class="text-slate-700 dark:text-slate-300 italic">${q.userAnswer}</p>
          </div>

          <!-- Strengths & Mistakes identified -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <div class="font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Key Strengths Demonstrated:
              </div>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                ${q.strengths.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>

            <div class="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <div class="font-bold text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Areas to Fix / Key Mistakes:
              </div>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                ${q.mistakes.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Ideal Answer -->
          <div class="p-3 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <div class="font-bold text-indigo-700 dark:text-indigo-400 mb-1 uppercase tracking-wider text-[10px]">✨ Recommended Golden Response:</div>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${q.idealAnswer}</p>
          </div>
        </div>
      `).join('');
    }
  }

  saveScorecardToStorage() {
    if (!this.latestScorecard) return;
    try {
      const existing = JSON.parse(localStorage.getItem('margdarshak_mock_history') || '[]');
      existing.unshift(this.latestScorecard);
      localStorage.setItem('margdarshak_mock_history', JSON.stringify(existing.slice(0, 15)));

      // Cloud DB Sync (Multi-User)
      const userId = window.studentAuth?.getUserId() || 'usr_demo';
      fetch('/api/dashboard/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({
          role: this.selectedRole?.title || "Systems Engineer",
          company: this.selectedCompany || "Tata Consultancy Services (TCS)",
          overallRating: this.latestScorecard.score || 8.0,
          feedback: this.latestScorecard.overallFeedback || "Mock interview session completed."
        })
      }).catch(err => console.warn("Cloud DB interview save note (offline fallback):", err));

      const saveBtn = document.getElementById('saveScorecardToDashboardBtn');
      if (saveBtn) {
        saveBtn.textContent = "Saved to Dashboard! ✓";
        saveBtn.classList.add('bg-emerald-600', 'text-white');
        setTimeout(() => {
          saveBtn.textContent = "Save to Student Dashboard";
          saveBtn.classList.remove('bg-emerald-600', 'text-white');
        }, 2000);
      }

      if (window.audioAssistant) window.audioAssistant.playClick();
      if (window.studentDashboard) window.studentDashboard.loadDashboardData();
    } catch (e) {
      console.warn("Storage error", e);
    }
  }
}

// Global initialization
window.mockInterviewer = new MockInterviewer();
