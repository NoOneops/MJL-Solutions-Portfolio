/* =========================================================
   MJL SOLUTION — SCRIPT.JS
   Four small features, each in its own section:
   1. Dark mode toggle (remembers your choice)
   2. Mobile menu open/close
   3. Scroll-reveal animation (fade elements in as you scroll)
   4. Portfolio filter buttons
   ========================================================= */

/* ---------- 1. DARK MODE TOGGLE ---------- */
/* Dark is the DEFAULT look now (futuristic theme). The toggle lets
   people switch to the lighter, corporate-style theme instead. We
   store the choice in localStorage so it's remembered next visit. */

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const root = document.documentElement;

// On page load, check if the user already chose light mode before
const savedTheme = localStorage.getItem('mjl-theme');
if (savedTheme === 'light') {
  root.setAttribute('data-theme', 'light');
  themeIcon.textContent = '🌙'; // clicking now offers to go back to dark
} else {
  themeIcon.textContent = '☀️'; // default dark mode; clicking offers light
}

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';

  if (isLight) {
    root.removeAttribute('data-theme');
    localStorage.setItem('mjl-theme', 'dark');
    themeIcon.textContent = '☀️';
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('mjl-theme', 'light');
    themeIcon.textContent = '🌙';
  }
});

/* ---------- 2. MOBILE MENU ---------- */

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Close the mobile menu automatically when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- 3. SCROLL REVEAL ---------- */
/* Every element with class "reveal" starts invisible (set in CSS).
   IntersectionObserver watches the page and adds "visible" to
   each one the moment it scrolls into view. No animation library
   needed — this is a built-in browser feature. */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

/* ---------- 4. PORTFOLIO FILTER ---------- */

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update which button looks "active"
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || filter === category;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

/* ---------- 5. HOVER TILT (portfolio cards) ---------- */
/* Only runs on devices with a real mouse. On touch devices there's no
   cursor to tilt toward, so we skip this and let the CSS :active
   tap-feedback (in style.css) handle it instead. */

const supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHoverTilt) {
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // How far the cursor is from center decides how much the card tilts.
      // Max tilt is capped at 6 degrees so it stays subtle, not dizzy.
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

/* ---------- FOOTER YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
