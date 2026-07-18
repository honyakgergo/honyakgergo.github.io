/* ══════════════════════════════════════════════════════════════
   Skill spiral — vertical 3D helix of the stack, scroll-scrubbed.
   Self-initialising. Expects in the DOM:
     section#vocab  (tall, 300vh)  →  div#vocabStage (fixed)  →  div#vhelix
     div#vFocusName (the "in focus" readout)
   The fixed stage is shown only while #vocab owns the viewport;
   the following .vocab-after wipes over it on exit.
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CDN = "https://cdn.simpleicons.org/";
  const AZURE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg";

  const STACK = [
    { name: "Python",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", accent: "#6f9bc4" },  // real blue+yellow mark
    { name: "pandas",       slug: "pandas",         accent: "#9c86b8" },  // muted plum
    { name: "PyTorch",      slug: "pytorch",        accent: "#cd7a56" },  // terracotta
    { name: "scikit-learn", slug: "scikitlearn",    accent: "#cb9a5c" },  // ochre
    { name: "Hugging Face", slug: "huggingface",    accent: "#cbb46e" },  // muted gold / wheat
    { name: "TensorFlow",   slug: "tensorflow",     accent: "#cf8850" },  // burnt amber
    { name: "FastAPI",      slug: "fastapi",        accent: "#6faa9b" },  // sage teal
    { name: "React",        slug: "react",          accent: "#78a9bd" },  // dusty aqua
    { name: "Streamlit",    slug: "streamlit",      accent: "#c56f66" },  // brick rose
    { name: "Docker",       slug: "docker",         accent: "#6d92bd" },  // slate blue
    { name: "GCP",          slug: "googlecloud",    accent: "#8399c6" },  // soft cornflower
    { name: "Azure",        icon: AZURE,            accent: "#618fb5" },  // steel blue
    { name: "Airflow",      slug: "apacheairflow",  accent: "#619aa6" },  // muted teal
    { name: "MLflow",       slug: "mlflow",         accent: "#6398b6" },  // dusty cerulean
    { name: "Git",          slug: "git",            accent: "#c47a58" },  // rust
    { name: "Postgres",     slug: "postgresql",     accent: "#7b8bb0" },  // muted indigo
  ];

  const section  = document.getElementById("vocab");
  const stageEl  = document.getElementById("vocabStage");
  const helix    = document.getElementById("vhelix");
  const nameEl   = document.getElementById("vFocusName");
  if (!section || !helix) return;

  const N = STACK.length;

  /* ---- build tiles (authored at 2× and scaled 0.5 → crisp when magnified) ---- */
  const tiles = STACK.map((s) => {
    const el = document.createElement("div");
    el.className = "vtile";
    const src = s.icon || (CDN + s.slug);
    el.innerHTML = `<span class="ic"><img src="${src}" alt="" loading="lazy"/></span><span class="nm">${s.name}</span>`;
    helix.appendChild(el);
    return { el, img: el.querySelector("img"), name: s.name };
  });

  /* ---- geometry / motion constants ---- */
  const R = 300, STEP_ANGLE = 40, STEP_Y = 126;
  const IDLE = 0.10;              // gentle drift when not scrolling
  const SCROLL_SPAN = N * 1.15;   // how many tiles a full scroll sweeps through
  const FOCUS = 0.55;            // |rel| under this = the focused tile
  const SCALE = 0.5;             // downscale the 2× authored tiles

  let curFocus = -1;
  const t0 = performance.now();

  function frame(now) {
    const t = (now - t0) / 1000;
    const r = section.getBoundingClientRect();
    const vh = innerHeight;
    const total = r.height - vh;
    const frac = total > 0 ? clamp(-r.top / total, 0, 1) : 0;

    // soft materialise: fade the whole stage in as it rises into view
    if (stageEl) stageEl.style.opacity = clamp((vh - r.top) / (vh * 0.55), 0, 1).toFixed(3);

    const progress = (reduce ? 0 : t * IDLE) + frac * SCROLL_SPAN;

    let bestRel = 1e9, bestIdx = 0;
    for (let i = 0; i < N; i++) {
      const T = tiles[i];
      let rel = ((i - progress) % N + N) % N;   // 0 = at the front
      if (rel > N / 2) rel -= N;                 // wrap to [-N/2, N/2]
      const af = Math.abs(rel);

      const ang = rel * STEP_ANGLE;
      const y = rel * STEP_Y;
      const rad = ang * Math.PI / 180;
      const z = Math.cos(rad) * R;
      const x = Math.sin(rad) * R;

      const focused = af < FOCUS;
      const depth = clamp(1 - af / (N / 2), 0, 1);
      const scale = (focused ? 1.18 : 0.86 + depth * 0.22) * SCALE;
      const op = focused ? 1 : clamp(0.16 + depth * 0.8, 0.12, 0.9);
      const blur = af > 0.9 ? clamp((af - 0.9) * 2.4, 0, 6) : 0;

      T.el.style.transform =
        `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-ang}deg) scale(${scale})`;
      T.el.style.zIndex = String(1000 - Math.round(af * 10));
      T.el.style.opacity = op;
      T.el.style.filter = blur > 0.3 ? `blur(${blur}px)` : "none";
      T.el.classList.toggle("focus", focused);
      T.img.style.filter = focused ? "none" : "saturate(.45) brightness(1.25)";
      T.img.style.opacity = focused ? 1 : 0.7;

      if (af < bestRel) { bestRel = af; bestIdx = i; }
    }

    if (bestIdx !== curFocus) {
      curFocus = bestIdx;
      if (stageEl) stageEl.style.setProperty('--focus', STACK[bestIdx].accent || '#5b93ff');
      if (nameEl) {
        nameEl.style.opacity = "0";
        setTimeout(() => { nameEl.textContent = tiles[bestIdx].name; nameEl.style.opacity = "1"; }, 130);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
