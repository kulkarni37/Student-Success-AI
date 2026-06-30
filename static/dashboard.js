/**
 * ============================================================
 *  STUDENT SUCCESS AI — dashboard.js
 *  Refactored · Clean · Production-Ready
 * ============================================================
 *
 *  Sections:
 *  1.  Utilities          – DOM helpers, toast
 *  2.  Greeting & Date    – Dynamic welcome text
 *  3.  Sidebar            – Mobile toggle, overlay, nav state
 *  4.  Notifications      – Bell-panel open/close
 *  5.  AI Insights Panel  – Floating card show/dismiss
 *  6.  AI Assistant       – Analyze, chips, typewriter effect
 *  7.  Task Checkboxes    – Priority list completion state
 *  8.  Analytics Tabs     – Week / Month switcher
 *  9.  Quick Actions      – Action buttons + Add Task modal
 *  10. Add Task Modal     – Open / close logic (shared)
 *  11. Card Animations    – Ring fills, counter roll-up
 *  12. Planner            – Study block z-index on hover
 *  13. Search Shortcuts   – ⌘K focus, Escape blur
 *  14. Accessibility      – prefers-reduced-motion
 *  15. Init               – Boot sequence
 * ============================================================
 */

(function () {
  'use strict';

  /* ============================================================
     1. UTILITIES
     ============================================================ */

  /**
   * Shorthand querySelector — returns null gracefully if missing.
   * @param {string} selector
   * @param {Element} [scope=document]
   */
  const $ = (selector, scope = document) => scope.querySelector(selector);

  /**
   * Shorthand querySelectorAll — always returns an array.
   * @param {string} selector
   * @param {Element} [scope=document]
   */
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /**
   * Show a floating toast message.
   * Replaces any existing toast before showing the new one.
   * @param {string} message
   */
  function showToast(message) {
    const existing = $('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;

    Object.assign(toast.style, {
      position:      'fixed',
      bottom:        '340px',
      right:         '24px',
      background:    'rgba(17,24,39,0.95)',
      border:        '1px solid rgba(99,102,241,0.3)',
      backdropFilter:'blur(16px)',
      color:         '#f1f5f9',
      fontFamily:    "'Inter', sans-serif",
      fontSize:      '13px',
      fontWeight:    '500',
      padding:       '12px 18px',
      borderRadius:  '12px',
      zIndex:        '9999',
      boxShadow:     '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.15)',
      opacity:       '0',
      transform:     'translateY(10px)',
      transition:    'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      maxWidth:      '280px',
    });

    document.body.appendChild(toast);

    // Trigger enter animation on next frame
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-dismiss after 3 s
    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }


  /* ============================================================
     2. GREETING & DATE
     ============================================================ */

  function initGreeting() {
    const el = document.getElementById('greetingDate');
    if (!el) return;

    const now    = new Date();
    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];

    el.textContent =
      `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }


  /* ============================================================
     3. SIDEBAR
     ============================================================ */

  function initSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const toggle   = document.getElementById('hamburger');
    const overlay  = document.getElementById('sidebarOverlay');

    if (!sidebar) return;

    const open = () => {
      sidebar.classList.add('open');
      overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      sidebar.classList.remove('open');
      overlay?.classList.remove('open');
      document.body.style.overflow = '';
    };

    toggle?.addEventListener('click', open);
    overlay?.addEventListener('click', close);

    // Active nav state + mobile auto-close
    $$('.nav-item').forEach(item => {
     item.addEventListener('click', () => {

    $$('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    if (window.innerWidth < 900) close();
});
      

      // Subtle glow on hover
      item.addEventListener('mouseenter', () => {
        item.style.boxShadow = '0 0 15px rgba(99,102,241,0.05)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.boxShadow = '';
      });
    });
  }


  /* ============================================================
     4. NOTIFICATIONS
     ============================================================ */

  function initNotifications() {
    const btn   = document.getElementById('notifBtn');
    const panel = document.getElementById('notifPanel');

    if (!btn || !panel) return;

    let isOpen = false;

    const toggle = e => {
      e.stopPropagation();
      isOpen = !isOpen;
      panel.classList.toggle('open', isOpen);
    };

    const closeIfOutside = e => {
      if (isOpen && !panel.contains(e.target) && e.target !== btn) {
        isOpen = false;
        panel.classList.remove('open');
      }
    };

    btn.addEventListener('click', toggle);
    document.addEventListener('click', closeIfOutside);
  }


  /* ============================================================
     5. AI INSIGHTS PANEL
     ============================================================ */

  function initInsightsPanel() {
    const panel   = document.getElementById('insightsPanel');
    const closeX  = document.getElementById('insightsClose');
    const dismiss = document.getElementById('insightsDismiss');

    if (!panel) return;

    const hide = () => {
      panel.style.transition = 'all 0.3s ease';
      panel.style.opacity    = '0';
      panel.style.transform  = 'translateY(20px) scale(0.95)';
      setTimeout(() => { panel.style.display = 'none'; }, 300);
    };

    closeX?.addEventListener('click',  hide);
    dismiss?.addEventListener('click', hide);

    // Delayed entrance on page load
    panel.style.display = 'none';
    setTimeout(() => {
      panel.style.display   = 'block';
      panel.style.opacity   = '0';
      panel.style.transform = 'translateY(20px)';

      requestAnimationFrame(() => {
        panel.style.transition = 'all 0.5s cubic-bezier(0.4,0,0.2,1)';
        panel.style.opacity    = '1';
        panel.style.transform  = 'translateY(0)';
      });
    }, 1800);
  }


  /* ============================================================
     6. AI ASSISTANT
     ============================================================ */

  // Response templates keyed by intent
  const AI_RESPONSES = {
    default: [
      '📋 Study Plan Generated:\n',
      '\nBased on your 5 assignments and 2 exams, here\'s your optimized plan:\n',
      '\n⏰ TODAY (Priority: CRITICAL)',
      '\n  • 2:00–4:00 PM — CN Assignment (finish remaining 35%)',
      '\n  • 4:30–6:00 PM — AI Lab Record (final review)\n',
      '\n📅 TOMORROW',
      '\n  • 9:00–11:00 AM — CN Exam Revision (key topics)',
      '\n  • 2:00–4:00 PM — DBMS Mini Project (schema design)\n',
      '\n📅 DAY 3+',
      '\n  • DBMS Project implementation',
      '\n  • Research Paper outline\n',
      '\n⚠ Risk Level: Medium → Projected Low after today',
      '\n✅ Completion probability: 91% with this plan',
    ].join(''),

    plan: [
      '🎯 Personalized Study Plan:\n',
      '\nI\'ve analyzed your current workload and academic history:\n',
      '\nPriority Queue:',
      '\n  1. CN Assignment (Due Today) ⚡',
      '\n  2. AI Lab Record (Due Today) ⚡',
      '\n  3. CN Exam Prep (28 Jun)',
      '\n  4. DBMS Mini Project (30 Jun)\n',
      '\nRecommended Pomodoro blocks: 4 sessions × 45 min today',
      '\nBreak intervals: 10 min after each block',
    ].join(''),

    risk: [
      '📊 Risk Analysis Report:\n',
      '\nCurrent Academic Risk Score: 42/100 (Medium)\n',
      '\nRisk Factors:',
      '\n  ⚠ CN Assignment incomplete (65%)',
      '\n  ⚠ Exam prep time is low (4h remaining)',
      '\n  ✓ Study streak maintained (12 days)',
      '\n  ✓ DBMS project on track\n',
      '\nAction: Complete CN Assignment in next 3 hours',
      '\nProjected risk after action: Low (Score: 28/100)',
    ].join(''),

    summary: [
      '⚡ Quick Summary:\n',
      '\nYou have 9 pending tasks, 2 of which are due today.',
      '\nStudy hours this week: 34h (above target ✅)',
      '\nUpcoming exams: 1 (CN — 28 Jun)',
      '\nInternship deadlines: 1 (TCS NQT — 2 Jul)\n',
      '\nTop action: Complete AI Lab Record tonight.',
      '\nYou\'re on track — maintain the streak! 🔥',
    ].join(''),
  };

  /** Pick an AI response based on keywords in the query. */
  function pickResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('plan') || q.includes('schedule')) return AI_RESPONSES.plan;
    if (q.includes('risk') || q.includes('danger'))   return AI_RESPONSES.risk;
    if (q.includes('summary') || q.includes('quick')) return AI_RESPONSES.summary;
    return AI_RESPONSES.default;
  }

  /** Animate text into an element character by character. */
  function typeText(el, text, speed = 12) {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i++];
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  /** Restore the Analyze button to its default state. */
  function resetAnalyzeBtn(btn) {
    btn.disabled = false;
    btn.innerHTML = `
      <span class="btn-glow"></span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" fill="currentColor"/>
      </svg>
      Analyze with AI`;
  }

  function initAIAssistant() {
    const analyzeBtn     = document.getElementById('analyzeBtn');
    const aiInput        = document.getElementById('aiInput');
    const aiResponse     = document.getElementById('aiResponse');
    const aiResponseBody = document.getElementById('aiResponseBody');
    const generateBtn    = document.getElementById('generatePlanBtn');

    // ── Chip preset prompts ──────────────────────────────────
    const CHIP_PROMPTS = {
      'Study Plan':    'Create a study plan for this week based on my current pending tasks.',
      'Quick Summary': 'Give me a quick summary of my academic status this week.',
      'Risk Analysis': 'Analyze my academic risk and what I need to do to reduce it.',
    };

    $$('.ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (!aiInput) return;
        const label = chip.textContent.trim();
        const match = Object.keys(CHIP_PROMPTS).find(key => label.includes(key));
        if (match) aiInput.value = CHIP_PROMPTS[match];
        aiInput.focus();
      });
    });

    // ── Generate AI Plan quick-action shortcut ───────────────
    generateBtn?.addEventListener('click', () => {
      if (!aiInput) return;
      aiInput.value = 'Generate a full AI study plan for my upcoming assignments and exams.';
      aiInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      aiInput.focus();
      // Small delay so scroll settles before analysis starts
      setTimeout(() => analyzeBtn?.click(), 400);
    });

    // ── Main Analyze button ──────────────────────────────────
    if (!analyzeBtn) return;

    analyzeBtn.addEventListener('click', () => {
      const query = aiInput?.value.trim() ?? '';

      // Validate — flash red border if empty
      if (!query) {
        if (aiInput) {
          aiInput.focus();
          aiInput.style.borderColor = 'rgba(248,113,113,0.5)';
          setTimeout(() => { aiInput.style.borderColor = ''; }, 1500);
        }
        return;
      }

      // Loading state
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = `
        <span class="btn-glow"></span>
        <div class="loading-dots"><span></span><span></span><span></span></div>
        Analyzing...`;

      if (aiResponse && aiResponseBody) {
        aiResponse.style.display = 'block';
        aiResponseBody.innerHTML = `
          <div class="loading-dots" style="padding:10px 0;">
            <span></span><span></span><span></span>
          </div>`;
      }

      // Simulate AI processing delay then stream the response
      fetch("/analyze-ai", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        prompt: query
    })
})
.then(response => response.json())
.then(data => {

    if (aiResponseBody) {
        aiResponseBody.innerHTML = "";
       const formatted = data.response
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

aiResponseBody.innerHTML = formatted;
    }

    resetAnalyzeBtn(analyzeBtn);

})
.catch(error => {

    if (aiResponseBody) {
        aiResponseBody.innerHTML =
            "<span style='color:red;'>Error connecting to Gemini AI.</span>";
    }

    resetAnalyzeBtn(analyzeBtn);

    console.error(error);

});
    }
  );
}



  /* ============================================================
     7. TASK CHECKBOXES
     ============================================================ */

  function initTaskCheckboxes() {
    $$('.priority-item .custom-check input').forEach(cb => {
      cb.addEventListener('change', () => {
        const item     = cb.closest('.priority-item');
        const nameEl   = item?.querySelector('.priority-name');
        const progFill = item?.querySelector('.progress-fill');
        const progPct  = item?.querySelector('.progress-pct');

        if (cb.checked) {
          if (nameEl) {
            nameEl.style.textDecoration = 'line-through';
            nameEl.style.opacity        = '0.5';
          }
          if (progFill) progFill.style.width = '100%';
          if (progPct)  progPct.textContent  = '100%';
          if (item) {
            item.style.opacity    = '0.7';
            item.style.background = 'rgba(52,211,153,0.04)';
          }
          showToast('Task completed! 🎉');
        } else {
          if (nameEl) {
            nameEl.style.textDecoration = '';
            nameEl.style.opacity        = '';
          }
          if (item) {
            item.style.opacity    = '';
            item.style.background = '';
          }
        }
      });
    });
  }


  /* ============================================================
     8. ANALYTICS TABS
     ============================================================ */

  function initAnalyticsTabs() {
    $$('.atab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.atab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Future: pass tab.dataset.tab to a chart-render function here
      });
    });
  }


  /* ============================================================
     9. QUICK ACTIONS
     ============================================================ */

  /**
   * Quick action buttons that should show a "launching soon" toast.
   * We explicitly exclude:
   *   - #generatePlanBtn  (handled by AI assistant section)
   *   - #openModal        (handled by modal section)
   */
  function initQuickActions() {
    $$('.qa-btn').forEach(btn => {
      // Skip buttons with dedicated handlers
      if (btn.id === 'generatePlanBtn' || btn.id === 'openModal') return;

      btn.addEventListener('click', () => {
        const label = btn.querySelector('span')?.textContent.trim() ?? 'Action';
        showToast(`${label} — feature launching soon! ✨`);
      });
    });
  }


  /* ============================================================
     10. ADD TASK MODAL
         Both entry points share a single open() function.
         Entry points:
           • Quick Actions button  → id="openModal"
           • Priorities "+" button → class="add-task-mini"
     ============================================================ */

  function initTaskModal() {
    const modal     = document.getElementById('taskModal');
    const closeBtn  = document.getElementById('closeModal');

    // Entry point buttons
    const openModalBtn   = document.getElementById('openModal');
    const addTaskMiniBtn = $('.add-task-mini');

    // Nothing to do if the modal doesn't exist in the DOM
    if (!modal) return;

    const openModal = () => {
      modal.style.display = 'flex';
      // Allow display:flex to paint before triggering the fade-in transition
      requestAnimationFrame(() => {
        modal.classList.add('open');
      });
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('open');
      // Wait for CSS transition to finish before hiding
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    };

    // Wire entry points
    openModalBtn?.addEventListener('click',   openModal);
    addTaskMiniBtn?.addEventListener('click', openModal);

    // Wire close mechanisms
    closeBtn?.addEventListener('click', closeModal);

    // Click outside the modal content closes it
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    // Escape key closes the modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }


  /* ============================================================
     11. CARD ANIMATIONS — Ring fills & counter roll-up
     ============================================================ */

  function initRingAnimations() {
    $$('.ring-fill').forEach(ring => {
      const pct = parseInt(ring.style.getPropertyValue('--pct'), 10) || 0;
      // Start collapsed
      ring.style.strokeDashoffset = '150';
      // Animate to target after a short delay
      setTimeout(() => {
        ring.style.transition       = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
        ring.style.strokeDashoffset = String(150 - (150 * pct / 100));
      }, 300);
    });
  }

  function initCounterAnimations() {
    $$('.stat-value[data-count]').forEach(el => {
      const target   = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix   = el.textContent.replace(/[0-9]/g, '');
      const duration = 900;
      let startTime  = null;

      const step = ts => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      setTimeout(() => requestAnimationFrame(step), 400);
    });
  }


  /* ============================================================
     12. PLANNER — Study block z-index on hover
     ============================================================ */

  function initPlanner() {
    $$('.study-block').forEach(block => {
      block.addEventListener('mouseenter', () => { block.style.zIndex = '10'; });
      block.addEventListener('mouseleave', () => { block.style.zIndex = ''; });
    });
  }


  /* ============================================================
     13. SEARCH SHORTCUTS
     ============================================================ */

  function initSearchShortcuts() {
    document.addEventListener('keydown', e => {
      const search = $('.search-input');
      if (!search) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        search.focus();
      } else if (e.key === 'Escape' && document.activeElement === search) {
        search.blur();
      }
    });
  }


  /* ============================================================
     14. ACCESSIBILITY — Respect prefers-reduced-motion
     ============================================================ */

  function initReducedMotion() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animated = [
      '.ai-orb',
      '.insights-orb',
      '.ai-status-badge',
      '.btn-glow',
    ];

    $$(animated.join(', ')).forEach(el => {
      el.style.animation = 'none';
    });
  }


  /* ============================================================
     15. INIT — Boot all modules in order
     ============================================================ */

  function init() {
    initGreeting();
    initSidebar();
    initNotifications();
    initInsightsPanel();
    initAIAssistant();
    initTaskCheckboxes();
    initAnalyticsTabs();
    initQuickActions();
    initTaskModal();
    initRingAnimations();
    initCounterAnimations();
    initPlanner();
    initSearchShortcuts();
    initReducedMotion();

    console.log('%cStudent Success AI v2.0', 'color:#818cf8;font-size:16px;font-weight:700;');
    console.log('%cRefactored · Clean · Production-Ready 🚀', 'color:#a78bfa;font-size:12px;');
  }

  // Boot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ═══════════════════════════════════════════════════════════
   ADD TASK MODAL
   Appended to bottom of dashboard.js — self-contained IIFE.
   Handles both trigger buttons without touching existing code.
═══════════════════════════════════════════════════════════ */

(function initTaskModal() {
  var overlay   = document.getElementById('taskModal');
  var closeBtn  = document.getElementById('closeModal');
  var cancelBtn = document.getElementById('cancelModal');

  // Both buttons that should open the modal
  var triggers = [
    document.getElementById('openModal'),      // Quick Actions → Add Task
    document.getElementById('addTaskMiniBtn'), // Priorities   → + Add
  ];

  // Bail silently if the modal HTML is missing
  if (!overlay) return;

  /* ── Open ── */
  function openModal() {
    overlay.style.display = 'flex';
    // One rAF ensures display:flex is painted before opacity transitions
    requestAnimationFrame(function () {
      overlay.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }

  /* ── Close ── */
  function closeModal() {
    overlay.classList.remove('open');
    // Wait for the CSS fade-out (0.25 s) before removing from layout
    setTimeout(function () {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 260);
  }

  /* ── Wire open triggers ── */
  triggers.forEach(function (btn) {
    if (btn) btn.addEventListener('click', openModal);
  });

  /* ── Wire close triggers ── */
  if (closeBtn)  closeBtn.addEventListener('click',  closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  /* ── Click on the dark backdrop closes the modal ── */
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  /* ── Escape key closes the modal ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });
})();
// ===============================
// Search Tasks
// ===============================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

       document.querySelectorAll(".task-card, .timeline-task").forEach(task => {
            const title = task.dataset.title || "";
            const category = task.dataset.category || "";

            if (
                title.includes(value) ||
                category.includes(value)
            ) {
                task.style.display = "";
            } else {
                task.style.display = "none";
            }

        });

    });

}