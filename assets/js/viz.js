/* ══════════════════════════════════════════════════════════════
   Bespoke per-project SVG icon for home page cards. DARK EDITION —
   identical to ../../assets/js/viz.js except the colour constants
   are tuned for the dark theme (light strokes, lifted blue accent).

   Cases: equity (SwingLab) / graph (GNN) / waveform (Sentify) /
   candles (money_dashboard) / roots (NPEC) / smile (Prosperity)
   ══════════════════════════════════════════════════════════════ */

const C_INK = '#e6e7ea', C_SAGE = '#5b93ff', C_OCHRE = '#5b93ff', C_RUST = '#5b93ff', C_PAPER = '#16181c';
const C_DOWN = '#f0863f';

function viz(kind, tone, cap) {
  const fg = tone === 'ink' ? C_OCHRE : C_INK;
  const acc = tone === 'sage' ? C_RUST : (tone === 'ochre' ? C_RUST : (tone === 'ink' ? C_OCHRE : C_SAGE));
  const down = tone === 'ink' ? 'rgba(239,233,221,0.45)' : C_DOWN;
  const muted = tone === 'ink' ? 'rgba(239,233,221,0.25)' : 'rgba(255,255,255,0.16)';
  const capFill = muted;

  switch (kind) {

    /* ── SwingLab / MOM_BROAD: equity curve with VIX-exit bands ── */
    case 'equity':
      return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="eqg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${acc}" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="${acc}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <g stroke="${muted}" stroke-dasharray="2 5">
          <line x1="20" y1="60" x2="380" y2="60"/>
          <line x1="20" y1="120" x2="380" y2="120"/>
          <line x1="20" y1="180" x2="380" y2="180"/>
        </g>
        <!-- shaded out-of-market (VIX exit) bands -->
        <rect class="anim-band" x="120" y="30" width="26" height="170" fill="${down}" opacity="0.14"/>
        <rect class="anim-band" x="248" y="30" width="18" height="170" fill="${down}" opacity="0.14"/>
        <path class="anim-curve-fill" d="M 20,190 L 60,182 100,186 120,176 146,174 180,150 216,158 248,140 266,126 300,96 336,66 358,50 380,34 L 380,198 L 20,198 Z" fill="url(#eqg)" opacity="0"/>
        <polyline class="anim-curve" points="20,190 60,182 100,186 120,176 146,174 180,150 216,158 248,140 266,126 300,96 336,66 358,50 380,34"
          fill="none" stroke="${acc}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle class="anim-curve-dot" cx="380" cy="34" r="5" fill="${acc}"/>
        <text x="20" y="235" font-family="JetBrains Mono, monospace" font-size="9" fill="${capFill}">${cap || 'MOM_BROAD equity curve'}</text>
      </svg>`;

    /* ── GNN thesis: correlation graph, nodes + edges ───────────── */
    case 'graph': {
      const nodes = [[70,70],[150,50],[230,80],[310,55],[110,140],[195,155],[280,150],[340,120],[55,190],[160,210],[250,200],[330,205]];
      const edges = [[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],[9,10],[10,11]];
      const hi = [4,5,7,11]; // highlighted "predictive" edges
      const edgePath = (a,b,cls) => `<line class="${cls}" x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${cls==='anim-edge-hi'?acc:muted}" stroke-width="${cls==='anim-edge-hi'?1.6:1}"/>`;
      return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
        <g>
          ${edges.map((e,i) => edgePath(e[0], e[1], hi.includes(i) ? 'anim-edge-hi' : 'anim-edge')).join('')}
        </g>
        <g class="anim-nodes">
          ${nodes.map(([x,y],i) => `<circle class="anim-node" cx="${x}" cy="${y}" r="${i%3===0?5:3.6}" fill="${fg}" opacity="${i%3===0?1:0.7}"/>`).join('')}
        </g>
        <text x="20" y="235" font-family="JetBrains Mono, monospace" font-size="9" fill="${capFill}">${cap || 'correlation graph'}</text>
      </svg>`;
    }

    /* ── Sentify: waveform → classifier → 7 emotion classes → retrain loop ── */
    case 'waveform': {
      const wave = [8,14,22,12,28,18,34,20,26,16,10,20,30,14,8];
      const emo = [22,38,16,44,28,34,20];
      return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(20,90)">
          ${wave.map((h,i) => `<rect class="anim-wave" x="${i*9}" y="${20-h/2}" width="5" height="${h}" rx="1.5" fill="${acc}" opacity="0.8"/>`).join('')}
        </g>
        <path class="edge" d="M175,110 H205" stroke="${muted}" stroke-width="1" fill="none"/>
        <rect x="210" y="86" width="54" height="48" rx="6" fill="none" stroke="${fg}" stroke-width="1.2"/>
        <text x="237" y="114" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="${fg}">BERT</text>
        <path d="M264,110 H285" stroke="${muted}" stroke-width="1" fill="none"/>
        <g transform="translate(290,60)">
          ${emo.map((h,i) => `<rect class="anim-bar" x="${i*13}" y="${100-h}" width="8" height="${h}" rx="1" fill="${acc}" opacity="${i===3?1:0.5}"/>`).join('')}
        </g>
        <path class="anim-loop" d="M300,178 Q160,215 90,150" stroke="${acc}" stroke-width="1.2" fill="none" stroke-dasharray="3 4" marker-end="url(#arrhead)"/>
        <defs>
          <marker id="arrhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6 Z" fill="${acc}"/>
          </marker>
        </defs>
        <text x="20" y="235" font-family="JetBrains Mono, monospace" font-size="9" fill="${capFill}">${cap || '7 classes \u00b7 retrain loop'}</text>
      </svg>`;
    }

    /* ── money_dashboard: OHLC candles + a regime threshold line ── */
    case 'candles': {
      const candles = [
        [40,120,90,150,'up'],[70,105,60,130,'up'],[100,140,95,160,'dn'],[130,110,80,145,'up'],
        [160,150,110,175,'dn'],[190,130,100,155,'up'],[220,160,120,185,'dn'],[250,120,90,150,'up'],
        [280,100,70,125,'up'],[310,115,85,140,'dn'],[340,90,60,115,'up'],[365,80,55,105,'up'],
      ];
      return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
        <g stroke="${muted}" stroke-dasharray="2 5">
          <line x1="20" y1="60" x2="380" y2="60"/>
          <line x1="20" y1="120" x2="380" y2="120"/>
          <line x1="20" y1="180" x2="380" y2="180"/>
        </g>
        <path d="M20,132 Q120,150 200,128 T380,96" stroke="${acc}" stroke-width="1" stroke-dasharray="4 3" fill="none" opacity="0.65"/>
        <g class="anim-candles">
          ${candles.map(([x,hi,lo,body,dir]) => `
            <line x1="${x+6}" y1="${hi}" x2="${x+6}" y2="${lo}" stroke="${dir==='up'?fg:down}" stroke-width="1"/>
            <rect x="${x}" y="${Math.min(hi+8,body-6)}" width="12" height="${Math.max(10,(body-6)-(hi+8))}" fill="${dir==='up'?fg:down}" opacity="${dir==='up'?0.85:0.7}"/>
          `).join('')}
        </g>
        <text x="20" y="235" font-family="JetBrains Mono, monospace" font-size="9" fill="${capFill}">${cap || 'live regime read'}</text>
      </svg>`;
    }

    /* ── NPEC: two branching root systems + a pipette dispensing water ── */
    case 'roots': {
      return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
        <!-- root system 1 -->
        <circle cx="64" cy="34" r="4" fill="${fg}"/>
        <path class="anim-path-main" d="M64,34 C62,64 66,84 60,104 C56,124 64,144 54,169 C48,186 52,202 44,216"
          stroke="${fg}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path class="anim-path" d="M60,72 C46,82 36,90 24,88" stroke="${muted}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path class="anim-path" d="M61,99 C78,108 90,112 104,104" stroke="${muted}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path class="anim-path" d="M57,132 C42,142 32,150 22,150" stroke="${muted}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path class="anim-path" d="M50,182 C38,190 30,196 22,200" stroke="${muted}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
        <!-- root system 2 (leans right so its tip sits under the pipette) -->
        <circle cx="150" cy="34" r="4" fill="${fg}"/>
        <path class="anim-path-main" d="M150,34 C153,64 149,86 160,106 C170,126 180,146 198,166 C214,184 232,198 248,214"
          stroke="${fg}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path class="anim-path" d="M160,106 C176,114 188,118 202,110" stroke="${muted}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path class="anim-path" d="M180,146 C164,156 154,162 142,160" stroke="${muted}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path class="anim-path" d="M216,186 C230,194 240,198 252,196" stroke="${muted}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <!-- pipette / dropper, tip directly above the root tip -->
        <g class="anim-arm" transform="translate(248,12)">
          <rect x="-9" y="0" width="18" height="11" rx="3.5" fill="none" stroke="${fg}" stroke-width="2"/>
          <rect x="-5" y="11" width="10" height="53" rx="2.5" fill="none" stroke="${fg}" stroke-width="2"/>
          <path d="M-5,64 L0,82 L5,64 Z" fill="${fg}"/>
        </g>
        <circle class="anim-splash" cx="248" cy="214" r="3" fill="none" stroke="${acc}" stroke-width="1.5" opacity="0"/>
        <circle class="anim-drop" cx="248" cy="100" r="3.6" fill="${acc}"/>
        <text x="20" y="235" font-family="JetBrains Mono, monospace" font-size="9" fill="${capFill}">${cap || 'U-Net \u2192 Dijkstra \u2192 OT-2'}</text>
      </svg>`;
    }

    /* ── IMC Prosperity: implied-vol smile across strikes ────────── */
    case 'smile': {
      return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet">
        <g stroke="${muted}" stroke-dasharray="2 5">
          <line x1="20" y1="180" x2="380" y2="180"/>
        </g>
        <text x="20" y="200" font-family="JetBrains Mono, monospace" font-size="8" fill="${capFill}">OTM PUT</text>
        <text x="178" y="200" font-family="JetBrains Mono, monospace" font-size="8" fill="${capFill}">ATM</text>
        <text x="340" y="200" font-family="JetBrains Mono, monospace" font-size="8" fill="${capFill}">OTM CALL</text>
        <path class="anim-curve" d="M30,70 C90,140 150,168 200,170 C250,168 310,140 370,66"
          fill="none" stroke="${acc}" stroke-width="2.4" stroke-linecap="round"/>
        <g fill="${fg}">
          <circle class="anim-mark" cx="30" cy="70" r="3.6"/>
          <circle class="anim-mark" cx="115" cy="150" r="3.6"/>
          <circle class="anim-mark" cx="200" cy="170" r="3.6"/>
          <circle class="anim-mark" cx="285" cy="150" r="3.6"/>
          <circle class="anim-mark" cx="370" cy="66" r="3.6"/>
        </g>
        <rect x="270" y="26" width="96" height="26" rx="13" fill="none" stroke="${acc}" stroke-width="1.2"/>
        <text x="318" y="43" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="${acc}">#223 / 18.8k</text>
        <text x="20" y="235" font-family="JetBrains Mono, monospace" font-size="9" fill="${capFill}">${cap || 'voucher IV smile'}</text>
      </svg>`;
    }
  }
  return '';
}

function animateViz(card) {
  /* equity */
  const curve = card.querySelector('.anim-curve');
  if (curve) {
    const len = curve.getTotalLength();
    gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(curve, { strokeDashoffset: 0, duration: 2.0, ease: 'power2.out' });
    const dot = card.querySelector('.anim-curve-dot');
    if (dot) gsap.from(dot, { scale: 0, transformOrigin: '50% 50%', duration: 0.6, delay: 1.8, ease: 'back.out(2)' });
    const fill = card.querySelector('.anim-curve-fill');
    if (fill) gsap.to(fill, { opacity: 1, duration: 1.4, delay: 1.0 });
  }
  card.querySelectorAll('.anim-band').forEach((b, i) => {
    gsap.from(b, { opacity: 0, duration: 0.8, delay: 0.3 + i * 0.15 });
  });

  /* graph */
  const edges = card.querySelectorAll('.anim-edge, .anim-edge-hi');
  if (edges.length) {
    gsap.from(edges, { opacity: 0, duration: 0.7, stagger: 0.03, ease: 'power1.out' });
    gsap.from(card.querySelectorAll('.anim-node'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.03, delay: 0.3, ease: 'back.out(2)' });
  }

  /* waveform */
  const waves = card.querySelectorAll('.anim-wave');
  if (waves.length) {
    gsap.from(waves, { scaleY: 0, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.03, ease: 'power2.out' });
  }
  const loop = card.querySelector('.anim-loop');
  if (loop) {
    const len = loop.getTotalLength();
    gsap.set(loop, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(loop, { strokeDashoffset: 0, duration: 1.4, delay: 0.9, ease: 'power2.out' });
  }

  /* candles */
  const candles = card.querySelector('.anim-candles');
  if (candles) {
    gsap.from(candles.children, { opacity: 0, y: 10, duration: 0.6, stagger: 0.04, ease: 'power2.out' });
  }

  /* roots + pipette */
  card.querySelectorAll('.anim-path-main').forEach((main, i) => {
    const len = main.getTotalLength();
    gsap.set(main, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(main, { strokeDashoffset: 0, duration: 1.6, delay: i * 0.25, ease: 'power2.out' });
  });
  card.querySelectorAll('.anim-path').forEach((p, i) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(p, { strokeDashoffset: 0, duration: 1.0, delay: 0.3 + i * 0.1, ease: 'power2.out' });
  });
  const arm = card.querySelector('.anim-arm');
  if (arm) gsap.from(arm, { opacity: 0, y: -10, duration: 0.9, delay: 0.6, ease: 'power2.out' });
  const drop = card.querySelector('.anim-drop');
  const splash = card.querySelector('.anim-splash');
  if (drop) {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: 1.4 });
    tl.set(drop, { y: 0, opacity: 0 });
    if (splash) tl.set(splash, { scale: 0.2, opacity: 0, transformOrigin: '50% 50%' });
    tl.to(drop, { opacity: 1, duration: 0.18 })
      .to(drop, { y: 114, duration: 0.95, ease: 'power1.in' }, '<0.05')
      .to(drop, { opacity: 0, duration: 0.14 });
    if (splash) tl.fromTo(splash, { scale: 0.2, opacity: 0.75 }, { scale: 2.6, opacity: 0, duration: 0.55, ease: 'power2.out' }, '<-0.04');
  }

  /* smile */
  card.querySelectorAll('.anim-mark').forEach((m, i) => {
    gsap.from(m, { scale: 0, transformOrigin: '50% 50%', duration: 0.5, delay: 0.8 + i * 0.12, ease: 'back.out(2)' });
  });
}
