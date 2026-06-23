/* ================================
   Security Mesh Canvas
   サイバーセキュリティ調の演出：
   ノード網 × データパケット × ロック/ヘックスのノード
   ================================ */
(function () {
  function initSecurityMesh(canvas, opts) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const o = Object.assign({
      lineRGB: '20, 50, 100',      // 接続線
      nodeRGB: '20, 50, 100',      // ノード
      goldRGB: '184, 148, 46',     // アクセント（ゴールド）
      density: 11000,              // 小さいほど多い
      maxNodes: 120,
      linkDist: 150,
      baseAlpha: 1,
    }, opts || {});

    let w, h, nodes, packets;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function build() {
      const count = Math.min(Math.floor((w * h) / o.density), o.maxNodes);
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.8 + 1.1,
          gold: Math.random() > 0.7,          // 一部をゴールドの「保護ノード」に
          secured: Math.random() > 0.82,      // ロック/ヘックス描画
          pulse: Math.random() * Math.PI * 2, // 明滅位相
        });
      }
      packets = [];
    }

    function hexNode(p, alpha) {
      // 六角形（セキュリティ＝堅牢な区画のメタファー）
      const R = p.r + 3.2;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const ang = (Math.PI / 3) * k - Math.PI / 6;
        const x = p.x + R * Math.cos(ang);
        const y = p.y + R * Math.sin(ang);
        k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${o.goldRGB}, ${alpha * 0.9})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();
      // 中心の点（ロックの掛け金イメージ）
      ctx.beginPath();
      ctx.fillStyle = `rgba(${o.goldRGB}, ${alpha})`;
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // 接続線
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < o.linkDist) {
            const a = o.baseAlpha * 0.22 * (1 - dist / o.linkDist);
            const anyGold = nodes[i].gold || nodes[j].gold;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = anyGold
              ? `rgba(${o.goldRGB}, ${a * 0.85})`
              : `rgba(${o.lineRGB}, ${a})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();

            // まれにデータパケット（暗号化された通信）を発生
            if (Math.random() < 0.0008 && packets.length < 18) {
              packets.push({ a: nodes[i], b: nodes[j], t: 0,
                sp: 0.012 + Math.random() * 0.02 });
            }
          }
        }
      }

      // データパケット（線上を走る光点）
      for (let k = packets.length - 1; k >= 0; k--) {
        const pk = packets[k];
        pk.t += pk.sp;
        if (pk.t >= 1) { packets.splice(k, 1); continue; }
        const x = pk.a.x + (pk.b.x - pk.a.x) * pk.t;
        const y = pk.a.y + (pk.b.y - pk.a.y) * pk.t;
        const fade = Math.sin(pk.t * Math.PI);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${o.goldRGB}, ${o.baseAlpha * 0.9 * fade})`;
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // ノード
      for (const p of nodes) {
        p.pulse += 0.02;
        const glow = 0.55 + 0.45 * Math.sin(p.pulse);

        if (p.secured) {
          hexNode(p, o.baseAlpha * glow);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4); // ひし形（区画ノード）
          ctx.fillStyle = p.gold
            ? `rgba(${o.goldRGB}, ${o.baseAlpha * (0.55 + 0.35 * glow)})`
            : `rgba(${o.nodeRGB}, ${o.baseAlpha * 0.6})`;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
          ctx.restore();
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); build(); });
    resize();
    build();
    draw();
  }

  // Hero（紺の没入背景）：明るめの線＋ゴールドのアクセントで浮かせる
  initSecurityMesh(document.getElementById('heroCanvas'), {
    lineRGB: '120, 160, 220', nodeRGB: '160, 190, 235', goldRGB: '212, 175, 55',
    density: 8500, maxNodes: 150, linkDist: 165, baseAlpha: 1.2,
  });

  // Mission / Values（紺の暗い背景・canvasは低opacity）：明るめの線で浮かせる
  initSecurityMesh(document.getElementById('missionCanvas'), {
    lineRGB: '120, 160, 220', nodeRGB: '150, 180, 230', goldRGB: '210, 175, 90',
    density: 12000, maxNodes: 90, linkDist: 150, baseAlpha: 1.6,
  });
  initSecurityMesh(document.getElementById('valuesCanvas'), {
    lineRGB: '120, 160, 220', nodeRGB: '150, 180, 230', goldRGB: '210, 175, 90',
    density: 12000, maxNodes: 90, linkDist: 150, baseAlpha: 1.6,
  });
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
    '.philosophy-card', '.contact-info', '.contact-form',
    '.idx-statement', '.idx-description', '.idx-pillar',
    '.idx-value-card', '.idx-service-lead'
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
