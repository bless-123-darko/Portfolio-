/* ============================================================
   PORTFOLIO — BLESSED DARKO YIRENKYI
   main.js — Scroll animations, typing effect, nav logic,
              particle canvas, contact form handling
   ============================================================ */

'use strict';

/* ── Utility: runs after DOM is ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initActiveNavLinks();
  initTypingEffect();
  initParticleCanvas();
  initContactForm();
});

/* ============================================================
   NAVBAR — scroll-triggered style change
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   MOBILE MENU — hamburger toggle
   ============================================================ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('hidden', !isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  /* Close menu when a link is clicked */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.add('hidden');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   SMOOTH SCROLL — for all .smooth-scroll anchors
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   SCROLL REVEAL — Intersection Observer for .reveal-item
   ============================================================ */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          /* Respect any animation-delay already set inline */
          const delay = parseFloat(getComputedStyle(entry.target).animationDelay) || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
}

/* ============================================================
   ACTIVE NAV LINKS — highlight on scroll via sections
   ============================================================ */
function initActiveNavLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const navHeight = () => document.getElementById('navbar')?.offsetHeight || 0;

  const setActive = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const top    = section.offsetTop - navHeight() - 60;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}

/* ============================================================
   TYPING EFFECT — cycles through roles
   ============================================================ */
function initTypingEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const roles = [
    'AI Engineer',
    'IT Infrastructure Specialist',
    'Web Developer',
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let isPaused   = false;

  const TYPE_SPEED   = 75;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 400;

  function tick() {
    const current = roles[roleIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(tick, PAUSE_BEFORE);
      return;
    }

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        isPaused   = true;
        roleIndex  = (roleIndex + 1) % roles.length;
      }
      setTimeout(tick, isDeleting ? DELETE_SPEED : TYPE_SPEED);
    }
  }

  setTimeout(tick, 800);
}

/* ============================================================
   PARTICLE CANVAS — subtle dot network in hero
   ============================================================ */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  const COUNT         = 60;
  const MAX_DIST      = 130;
  const PARTICLE_SIZE = 1.5;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.5 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, PARTICLE_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.update();
      p.draw();

      /* Draw connecting lines */
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset());
  }, { passive: true });
}

/* ============================================================
   CONTACT FORM — client-side validation + feedback
   ============================================================ */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    /* Basic validation */
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled     = true;
    submitBtn.textContent  = 'Sending…';

    fetch('https://formspree.io/f/xaqdpzyo', {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    })
      .then(res => {
        if (res.ok) {
          form.reset();
          showStatus("Message sent! I'll get back to you soon.", 'success');
        } else {
          return res.json().then(data => {
            const errMsg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
            showStatus(errMsg, 'error');
          });
        }
      })
      .catch(() => {
        showStatus('Network error. Please check your connection and try again.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      });
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className   = `text-center mt-5 text-sm ${type}`;
    status.classList.remove('hidden');
    setTimeout(() => status.classList.add('hidden'), 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
