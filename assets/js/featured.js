/* ══════════════════════════════════════════════════════════════
   Featured — horizontal scroll gallery, scroll-scrubbed.
   Self-initialising. Reads FEATURED_PROJECTS (projects-data.js),
   adds a 7th "More projects" card, and as #feat scrolls past it
   pins and slides the row of cards sideways (you travel rightward
   through them), then releases into the About section.
   Expects: section#feat > div#featStage > div#featTrack,
            #featTag, #featCta (+#featCtaLabel).
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* muted, earthy accent per project (matches the spiral palette) */
  const ACCENT = {
    'swinglab': '#6d92bd', 'gnn': '#8f7fb0', 'sentify': '#6faa9b',
    'money-dashboard': '#7f9e6b', 'prosperity': '#c0787f', 'npec': '#c39a5c',
  };
  /* short, punchy readout line per project */
  const TAG = {
    'swinglab': 'Quantitative research & trading platform',
    'gnn': 'Graph neural nets for equity factors',
    'sentify': 'Media emotion classifier · full MLOps',
    'money-dashboard': 'Live market cockpit, driven by the clock',
    'prosperity': '#223 / 18,800 · voucher IV smile',
    'npec': 'U-Net → Dijkstra → robotic arm',
  };
  /* a few enticing keywords per card (mirrors the archive) */
  const KEYS = {
    'swinglab': ['Live capital', 'Momentum', 'Backtester'],
    'gnn': ['Graph neural net', 'Alpha', 'Walk-forward'],
    'sentify': ['Emotion AI', 'Auto-retrain', 'On-prem'],
    'money-dashboard': ['Regime shift', 'Live breadth', 'Volatility'],
    'prosperity': ['Options', 'IV smile', 'Game theory'],
    'npec': ['Root seg', 'Robotics', 'U-Net'],
  };

  const feat = (typeof FEATURED_PROJECTS !== 'undefined' ? FEATURED_PROJECTS : []);
  const CARDS = feat.map(p => ({
    id: p.id, num: p.n, name: p.title, em: p.em,
    tag: TAG[p.id] || p.type, accent: ACCENT[p.id] || '#6d92bd',
    keys: KEYS[p.id] || (p.tags || []).slice(0, 3), href: `project.html?id=${p.id}`,
  }));
  CARDS.push({
    id: 'archive', num: '( all )', name: 'More projects', em: '',
    tag: 'The full archive — 11 projects', accent: '#7b8bb0',
    img: '', href: 'archive.html', more: true,
  });

  const N = CARDS.length;
  const section = document.getElementById('feat');
  const stage   = document.getElementById('featStage');
  const track   = document.getElementById('featTrack');
  const tagEl   = document.getElementById('featTag');
  const ctaEl   = document.getElementById('featCta');
  const ctaLbl  = document.getElementById('featCtaLabel');
  if (!section || !track) return;

  /* ---- build cards ---- */
  CARDS.forEach((c) => {
    const el = document.createElement('a');
    el.className = 'fcard' + (c.more ? ' more' : '');
    el.href = c.href;
    if (c.more) {
      el.innerHTML =
        `<div class="more-face" style="--a:${c.accent}"><div class="more-inner">
           <span class="more-t">More projects</span>
           <span class="more-s">The full archive →</span>
         </div></div>`;
    } else {
      el.innerHTML =
        `<div class="fface" style="--a:${c.accent}; background:
             radial-gradient(120% 100% at 18% 8%,  color-mix(in srgb, ${c.accent} 50%, transparent), transparent 58%),
             radial-gradient(130% 120% at 88% 96%, color-mix(in srgb, ${c.accent} 32%, transparent), transparent 62%),
             linear-gradient(160deg,#1c2029,#101319);">
           <span class="f-ghost">${c.num}</span>
           <div class="fmeta">
             <span class="ft">${c.name}${c.em ? ` <em>${c.em}</em>` : ''}</span>
             <div class="f-keys">${(c.keys || []).map(w => `<span>${w}</span>`).join('')}</div>
           </div>
         </div>`;
    }
    c.el = el;
    track.appendChild(el);
  });

  /* ---- MOBILE: native horizontal swipe carousel (no scroll-jacking) ---- */
  if (matchMedia('(max-width:820px)').matches) {
    let cur = -1;
    const syncReadout = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bestD = Infinity;
      for (let i = 0; i < N; i++) {
        const el = CARDS[i].el;
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best !== cur) {
        cur = best;
        const c = CARDS[best];
        stage.style.setProperty('--focus', c.accent);
        if (tagEl) tagEl.textContent = c.tag;
        if (ctaLbl) ctaLbl.textContent = c.more ? 'Browse the archive' : 'View ' + c.name;
        if (ctaEl) ctaEl.setAttribute('href', c.href);
        for (let i = 0; i < N; i++) CARDS[i].el.classList.toggle('focused', i === best);
      }
    };
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { syncReadout(); ticking = false; }); }
    }, { passive: true });
    if (stage) stage.style.opacity = '1';
    syncReadout();
    return;   // skip the desktop scroll-scrubbed coverflow
  }

  /* measure a card so spacing scales with real rendered width */
  let cardW = 0;
  function measure() {
    const first = track.querySelector('.fcard');
    cardW = (first && first.offsetWidth) ? first.offsetWidth : Math.min(innerWidth * 0.34, 520);
  }
  addEventListener('resize', measure);

  let curFocus = -1;

  function frame() {
    if (!cardW) measure();
    const r = section.getBoundingClientRect();
    const vh = innerHeight;
    const total = r.height - vh;
    const frac = total > 0 ? clamp(-r.top / total, 0, 1) : 0;

    // materialise as the section rises in (smooth handoff from the spiral)
    stage.style.opacity = clamp((vh - r.top) / (vh * 0.5), 0, 1).toFixed(3);

    const pos = frac * (N - 1);     // continuous position; you travel right as you scroll
    const step = cardW * 0.92;      // horizontal stride (more air between cards)
    for (let i = 0; i < N; i++) {
      const c = CARDS[i];
      const o = i - pos, ao = Math.abs(o);
      const x = o * step;                                   // slide sideways
      const rotY = -clamp(o, -3, 3) * 24;                  // side cards angle away
      const tz = 50 - Math.min(ao, 3) * 95;                // focused steps forward, sides recede
      const sc = ao < 1 ? lerp(1, 0.8, ao) : Math.max(0.58, 0.8 - (ao - 1) * 0.1);
      const op = ao > 3 ? 0 : Math.max(0.12, 1 - ao * 0.5);  // brightness peaks hard at centre
      c.el.style.transform =
        `translateX(${x}px) translateZ(${tz}px) rotateY(${rotY}deg) scale(${sc})`;
      c.el.style.opacity = op;
      c.el.style.zIndex = String(200 - Math.round(ao * 10));
      c.el.style.filter = ao < 0.5 ? 'none' : `brightness(${lerp(1, 0.64, clamp(ao, 0, 1.6) / 1.6)}) saturate(.88)`;
      c.el.style.pointerEvents = ao < 0.55 ? 'auto' : 'none';   // only the front card is clickable
      c.el.classList.toggle('focused', ao < 0.5);
      c.el.style.boxShadow = ao < 0.5
        ? `0 50px 110px -36px rgba(0,0,0,.95), 0 0 0 1px ${c.accent}66, 0 30px 90px -30px ${c.accent}70`
        : '0 40px 90px -44px rgba(0,0,0,.9)';
    }

    const fi = clamp(Math.round(pos), 0, N - 1);
    if (fi !== curFocus) {
      curFocus = fi;
      const c = CARDS[fi];
      stage.style.setProperty('--focus', c.accent);
      if (tagEl) { tagEl.style.opacity = '0'; setTimeout(() => { tagEl.textContent = c.tag; tagEl.style.opacity = '1'; }, 150); }
      if (ctaLbl) ctaLbl.textContent = c.more ? 'Browse the archive' : 'View ' + c.name;
      if (ctaEl) ctaEl.setAttribute('href', c.href);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
