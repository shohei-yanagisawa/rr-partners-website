/* ================================
   Neural Network Canvas (AI感演出 - Gold theme)
   ================================ */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor((w * h) / 10000), 130);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.5 + 1.2,
        gold: Math.random() > 0.45,
        shape: Math.floor(Math.random() * 2),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = 0.25 * (1 - dist / 160);
          const bothGold = particles[i].gold && particles[j].gold;
          const anyGold = particles[i].gold || particles[j].gold;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          if (bothGold) {
            ctx.strokeStyle = `rgba(184, 148, 46, ${alpha})`;
          } else if (anyGold) {
            ctx.strokeStyle = `rgba(100, 120, 80, ${alpha * 0.7})`;
          } else {
            ctx.strokeStyle = `rgba(20, 50, 100, ${alpha * 0.7})`;
          }
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw particles (squares & diamonds)
    for (const p of particles) {
      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.gold) {
        ctx.fillStyle = 'rgba(184, 148, 46, 0.8)';
      } else {
        ctx.fillStyle = 'rgba(20, 50, 100, 0.65)';
      }

      if (p.shape === 0) {
        // Diamond (45° rotated square)
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      } else {
        // Square
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      }
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();

/* ================================
   Hamburger Menu
   ================================ */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

/* ================================
   Scroll Reveal
   ================================ */
function initReveal() {
  const selectors = [
    '.section-label', '.section-title', '.gold-line',
    '.about-text', '.value-item', '.biz-card',
    '.insight-card', '.company-row', '.recruit-inner',
    '.service-preview', '.message-content', '.news-item',
    '.philosophy-card', '.contact-info', '.contact-form'
  ];
  const elements = document.querySelectorAll(selectors.join(', '));
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.06}s`;
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initReveal);

/* ================================
   Header scroll effect
   ================================ */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 80);
});
