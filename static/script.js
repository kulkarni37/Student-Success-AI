/* ============================================
   STUDENT SUCCESS AI — Premium JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAV SCROLL ──────────────────────────── */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ─── MOBILE MENU ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ─── COUNTER ANIMATION ───────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2200;
    const isFloat = target % 1 !== 0;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = isFloat
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = prefix + val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ─── INTERSECTION OBSERVERS ──────────────── */
  const observerOpts = { threshold: 0.15 };

  // Reveal elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, observerOpts);
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Timeline steps with stagger
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const steps = e.target.querySelectorAll('.timeline-step');
        steps.forEach((s, i) => {
          setTimeout(() => s.classList.add('visible'), i * 180);
        });
        timelineObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  const timeline = document.querySelector('.timeline');
  if (timeline) timelineObserver.observe(timeline);

  // Counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObserver.unobserve(e.target);
      }
    });
  }, observerOpts);
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) counterObserver.observe(statsSection);

  // Dashboard ring + bars
  const dashObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => {
          document.querySelectorAll('.risk-ring-fill').forEach(r => r.classList.add('animate'));
          document.querySelectorAll('.prob-bar-fill').forEach(r => r.classList.add('animate'));
          document.querySelectorAll('.deadline-prog-fill').forEach(el => {
            el.style.width = el.dataset.width || '0%';
          });
        }, 400);
        dashObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const dashCard = document.querySelector('.dashboard-card');
  if (dashCard) dashObserver.observe(dashCard);

  // On-load: trigger dashboard if in view immediately
  setTimeout(() => {
    if (dashCard) {
      const rect = dashCard.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        document.querySelectorAll('.risk-ring-fill').forEach(r => r.classList.add('animate'));
        document.querySelectorAll('.prob-bar-fill').forEach(r => r.classList.add('animate'));
        document.querySelectorAll('.deadline-prog-fill').forEach(el => {
          el.style.width = el.dataset.width || '0%';
        });
      }
    }
  }, 800);

  // Feature cards stagger
  const featObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.feat-card').forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 90);
        });
        featObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  const featGrid = document.querySelector('.features-grid');
  if (featGrid) {
    featGrid.querySelectorAll('.feat-card').forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(24px)';
      c.style.transition = 'opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    });
    featObserver.observe(featGrid);
  }

  /* ─── LIVE CLOCK TICKER ───────────────────── */
  const ticker = document.getElementById('liveTicker');
  function updateTicker() {
    if (!ticker) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    ticker.textContent = `${h}:${m}:${s}`;
  }
  updateTicker();
  setInterval(updateTicker, 1000);

  /* ─── CURSOR GLOW ─────────────────────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function animCursor() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top  = cy + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();
  }

  /* ─── SMOOTH ANCHOR SCROLL ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── TYPING EFFECT ON SUBHEADLINE ───────── */
  const typingTarget = document.getElementById('typingTag');
  if (typingTarget) {
    const words = ['AI Planning', 'Smart Prioritization', 'Deadline Prediction', '24/7 AI Mentor'];
    let wi = 0, ci = 0, deleting = false;
    function typeStep() {
      const word = words[wi];
      if (!deleting) {
        typingTarget.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(typeStep, 1800); return; }
      } else {
        typingTarget.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(typeStep, deleting ? 55 : 95);
    }
    typeStep();
  }

  /* ─── PARALLAX HERO BLOBS ─────────────────── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.blob').forEach((b, i) => {
      const speed = 0.08 + i * 0.04;
      b.style.transform += ` translateY(${y * speed}px)`;
    });
  }, { passive: true });

  /* ─── NOTIFICATION ROTATION ───────────────── */
  const notifs = [
    '✅ CN Assignment submitted!',
    '🔔 Exam in 3 days — start today',
    '📊 Risk score improved to 62%',
    '🎯 All deadlines on track!'
  ];
  const notifEl = document.querySelector('.notif-text');
  let ni = 0;
  if (notifEl) {
    setInterval(() => {
      notifEl.style.opacity = '0';
      setTimeout(() => {
        ni = (ni + 1) % notifs.length;
        notifEl.textContent = notifs[ni];
        notifEl.style.opacity = '1';
      }, 400);
    }, 3500);
    notifEl.style.transition = 'opacity 0.4s ease';
  }

});