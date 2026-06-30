/* ════════════════════════════════════════════════════════════
   STUDENT SUCCESS AI — Landing Page v2 Script
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL STATE ───────────────────────────────────── */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ── MOBILE NAV ─────────────────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  toggle?.addEventListener('click', () => mobileNav?.classList.toggle('open'));
  mobileNav?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 50);
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── ANALYTICS BARS ANIMATE ON SCROLL ───────────────────── */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.big-bar[data-h]').forEach((bar, i) => {
        setTimeout(() => { bar.style.height = bar.dataset.h; }, i * 90);
      });
      barObserver.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.big-bars').forEach(el => barObserver.observe(el));

  /* ── MINI RING CHARTS (productivity, completion, risk) ──── */
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.mr-fill[data-offset]').forEach(ring => {
        setTimeout(() => { ring.style.strokeDashoffset = ring.dataset.offset; }, 200);
      });
      ringObserver.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stack-mini').forEach(el => ringObserver.observe(el));

  /* ── DASHBOARD SHOWCASE MINI RISK RING ──────────────────── */
  const dmRingObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-offset]').forEach(ring => {
        setTimeout(() => { ring.style.strokeDashoffset = ring.dataset.offset; }, 250);
      });
      dmRingObserver.unobserve(e.target);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.dash-mock').forEach(el => dmRingObserver.observe(el));

  /* ── MODULE RAIL — drag to scroll on desktop ────────────── */
  const rail = document.getElementById('moduleRail');
  if (rail) {
    let isDown = false, startX, scrollLeft;
    rail.addEventListener('mousedown', e => {
      isDown = true;
      rail.style.cursor = 'grabbing';
      startX = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
    });
    ['mouseleave','mouseup'].forEach(evt => rail.addEventListener(evt, () => {
      isDown = false;
      rail.style.cursor = 'grab';
    }));
    rail.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      rail.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
    rail.style.cursor = 'grab';
  }

  /* ── FAQ ACCORDION — close others on open ───────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* ── CHAT MOCK — cycle through a second Q&A automatically ─ */
  const chatThread = document.getElementById('chatThread');
  const conversations = [
    {
      user: "I have a DBMS exam in 4 days and I'm stuck on normalization. Can you explain it simply?",
      ai: "Think of normalization as removing repeated information from your tables.<br><br><strong>1NF</strong> — every cell holds one value.<br><strong>2NF</strong> — no partial dependency on part of a key.<br><strong>3NF</strong> — no column depends on another non-key column.<br><br>Want a worked example using a student-course table?"
    },
    {
      user: "Yes please, and also tell me how much time I should give this topic.",
      ai: "Given your exam is in 4 days, I'd budget <strong>90 minutes</strong> today on 1NF→3NF with practice tables, then revisit with timed problems on day 3. I've added this to your <strong>Weekly Planner</strong> under Thursday evening."
    }
  ];
  let convoIdx = 0;

  function renderConvo(idx) {
    if (!chatThread) return;
    const c = conversations[idx];
    chatThread.innerHTML = `
      <div class="chat-msg user">${c.user}</div>
      <div class="chat-typing" id="typingIndicator">
        <span></span><span></span><span></span>
      </div>
    `;
    setTimeout(() => {
      const typing = document.getElementById('typingIndicator');
      if (typing) {
        typing.outerHTML = `<div class="chat-msg ai">${c.ai}</div>`;
      }
    }, 1400);
  }

  const chatObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      renderConvo(convoIdx);
      chatObserver.unobserve(e.target);
      // cycle conversations every 9s
      setInterval(() => {
        convoIdx = (convoIdx + 1) % conversations.length;
        renderConvo(convoIdx);
      }, 9000);
    });
  }, { threshold: 0.4 });
  if (chatThread) chatObserver.observe(chatThread.closest('.chat-mock'));

  /* ── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── TASK CHECKBOX TOGGLES IN HERO MODULE PREVIEW ───────── */
  document.querySelectorAll('.mod-check').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('on');
      box.closest('.mod-task-row')?.classList.toggle('done');
    });
  });

});