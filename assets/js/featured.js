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
    'swinglab': 'A quantitative research & trading platform, now running live on real capital',
    'gnn': 'Graph neural nets for cross-sectional equity return prediction',
    'sentify': 'A media emotion classifier wrapped in a full auto-retraining MLOps stack',
    'money-dashboard': 'A live market cockpit that reads regime shifts through the trading day',
    'prosperity': 'Solo entry, 223rd of 18,800 teams — options pricing off the IV smile',
    'npec': 'Root segmentation to robotics: U-Net → Dijkstra length → RL-controlled arm',
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
    keys: KEYS[p.id] || (p.tags || []).slice(0, 3), href: `/project/?id=${p.id}`,
  }));
  CARDS.push({
    id: 'archive', num: '( all )', name: 'More projects', em: '',
    tag: 'The full archive — 11 projects', accent: '#7b8bb0',
    img: '', href: '/archive/', more: true,
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
             linear-gradient(180deg, rgba(255,255,255,.07), transparent 34%),
             radial-gradient(120% 100% at 18% 8%,  color-mix(in srgb, ${c.accent} 64%, transparent), transparent 60%),
             radial-gradient(130% 120% at 88% 96%, color-mix(in srgb, ${c.accent} 44%, transparent), transparent 64%),
             linear-gradient(160deg,#2b3141,#171b24);">
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

  /* ---- MOBILE: swipe + arrow carousel (fixed-size cards, no coverflow scaling) ---- */
  if (matchMedia('(max-width:820px)').matches) {
    let cur = -1, targetIdx = 0, animating = false, sraf = null;

    // eased, hand-feeling glide to a card (softer than native smooth-scroll)
    const easeOut = t => 1 - Math.pow(1 - t, 3);   // decelerates like a flick coasting to rest
    const animateScroll = (to, dur = 560) => {
      if (sraf) cancelAnimationFrame(sraf);
      const start = track.scrollLeft, delta = to - start;
      if (Math.abs(delta) < 1) return;
      animating = true;
      track.style.scrollSnapType = 'none';   // stop snap from fighting the tween
      const t0 = performance.now();
      const stepA = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        track.scrollLeft = start + delta * easeOut(k);
        if (k < 1) { sraf = requestAnimationFrame(stepA); }
        else { sraf = null; animating = false; track.style.scrollSnapType = ''; }
      };
      sraf = requestAnimationFrame(stepA);
    };
    const goTo = (i) => {
      targetIdx = clamp(Math.round(i), 0, N - 1);
      const el = CARDS[targetIdx].el;
      animateScroll(el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2);
    };

    // prev / next arrows + position dots, dropped in just under the cards
    const nav = document.createElement('div');
    nav.className = 'feat-nav';
    const prev = document.createElement('button');
    prev.className = 'fn-prev'; prev.setAttribute('aria-label', 'Previous project');
    prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const next = document.createElement('button');
    next.className = 'fn-next'; next.setAttribute('aria-label', 'Next project');
    next.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const dots = document.createElement('div');
    dots.className = 'fn-dots';
    const dotEls = CARDS.map((c, i) => {
      const d = document.createElement('i');
      d.addEventListener('click', () => goTo(i));
      dots.appendChild(d);
      return d;
    });
    nav.append(prev, dots, next);
    const ro = stage.querySelector('.feat-readout');
    stage.insertBefore(nav, ro || null);
    prev.addEventListener('click', () => goTo(targetIdx - 1));
    next.addEventListener('click', () => goTo(targetIdx + 1));

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
        if (!animating) targetIdx = best;
        const c = CARDS[best];
        stage.style.setProperty('--focus', c.accent);
        if (tagEl) tagEl.textContent = c.tag;
        if (ctaLbl) ctaLbl.textContent = c.more ? 'Browse the archive' : 'View ' + c.name;
        if (ctaEl) ctaEl.setAttribute('href', c.href);
        for (let i = 0; i < N; i++) CARDS[i].el.classList.toggle('focused', i === best);
        dotEls.forEach((d, i) => d.classList.toggle('on', i === best));
        prev.disabled = best === 0;
        next.disabled = best === N - 1;
      }
    };
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { syncReadout(); ticking = false; }); }
    }, { passive: true });
    // if the user grabs the track mid-glide, hand control straight back to them
    track.addEventListener('touchstart', () => {
      if (sraf) { cancelAnimationFrame(sraf); sraf = null; animating = false; track.style.scrollSnapType = ''; }
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
    if (matchMedia('(max-width:820px)').matches) { stage.style.opacity = '1'; requestAnimationFrame(frame); return; }  // never drive the coverflow at phone widths
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
        ? `0 50px 110px -36px rgba(0,0,0,.95), 0 30px 90px -28px ${c.accent}66, 0 70px 170px -50px ${c.accent}4a`
        : `0 40px 90px -44px rgba(0,0,0,.9), 0 30px 100px -50px ${c.accent}26`;
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
