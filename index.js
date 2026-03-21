/* ================================
   MVV Page — Background canvases & counter animation
   ================================ */

/* ---- Particle system for section backgrounds ---- */
function initSectionCanvas(canvasId, opts) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles;
  const goldColor = opts.gold || 'rgba(212,175,55,';
  const subColor = opts.sub || 'rgba(160,185,220,';
  const count = opts.count || 50;
  const connectDist = opts.dist || 120;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function create() {
    particles = [];
    const n = Math.min(Math.floor((w * h) / 18000), count);
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.6,
        g: Math.random() > 0.4,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectDist) {
          const a = 0.15 * (1 - dist / connectDist);
          const isGold = particles[i].g || particles[j].g;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isGold ? goldColor + a + ')' : subColor + (a * 0.5) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.g ? goldColor + '0.65)' : subColor + '0.4)';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); create(); });
  resize();
  create();
  draw();
}

// Init section canvases
initSectionCanvas('missionCanvas', { count: 60, dist: 130 });
initSectionCanvas('valuesCanvas', { count: 55, dist: 120 });

/* ---- Counter animation ---- */
function animateCounters() {
  const nums = document.querySelectorAll('.idx-stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(target * ease);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
}

document.addEventListener('DOMContentLoaded', animateCounters);
