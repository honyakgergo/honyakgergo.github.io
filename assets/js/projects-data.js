/* ══════════════════════════════════════════════════════════════
   Single source of truth for every project: used by the home
   page (featured subset), the archive (full list + filtering),
   and the project detail page template.

   Image paths point to assets/images/<slug>/<file>. Drop the
   matching source screenshot into that folder under that exact
   name and it will appear automatically, no HTML edits needed.
   ══════════════════════════════════════════════════════════════ */

const CAT_LABEL = { ml: 'Machine Learning', quant: 'Quant', infra: 'Infra · Platform', research: 'Research', side: 'Side' };

const PROJECTS = [

  /* ── 1. SwingLab / MOM_BROAD ─────────────────────────────── */
  {
    id: 'swinglab',
    n: '01',
    year: '2026',
    cat: 'quant',
    title: 'SwingLab',
    em: 'and MOM_BROAD',
    role: 'Solo · Live',
    type: 'Quant research platform',
    tags: ['FastAPI', 'React', 'SQLite'],
    blurb: 'A full research platform, backtester, and monitor, currently trading real capital through a weekly momentum strategy.',
    featured: true,
    viz: 'equity',
    capText: 'VIX exit 25 / re-entry 20',
    stats: [
      { num: '37.3%', label: 'CAGR, VIX-exit' },
      { num: '1.425', label: 'Sharpe' },
      { num: '-20.4%', label: 'Max drawdown' },
    ],
    status: 'Live, trading real capital',
    copy: [
      "SwingLab is the largest thing I've built, a full quantitative research and trading platform, not just a single strategy script. It's where every strategy I design gets built, backtested, stress-tested, and eventually deployed, and it's also the platform currently trading my own capital live through MOM_BROAD.",
      "It's a proper application: a FastAPI backend handles data ingestion, indicator computation, and backtest execution, and a React frontend is the analysis workspace on top of it, drawing moving averages, Bollinger Bands, RSI, and running any strategy against history with full trade logging and drawdown breakdowns. SQLite was a deliberate choice here, not a default: for a single-user research platform running local backtests, a full server database adds latency for no benefit, and SQLite gives fast reads and writes with zero setup cost.",
      "The strategy currently running inside it is MOM_BROAD, a weekly cross-sectional momentum strategy trading a combined S&P 500 + QQQ universe. Stocks are ranked by 189-day relative strength, filtered through a walk-forward Boruta permutation test that checks whether a ticker's signal actually beats random shuffles of itself, then gated by a bull-regime check and a 3-vote indicator system (EWMAC, MACD, Supertrend) requiring at least 2 of 3 to agree before entry. The top 7 survivors are held equal-weight, sector-capped at 3 per GICS sector, with a VIX regime overlay that steps the whole book to cash above VIX 25 and back in below VIX 20.",
      "Backtested equal-weight without the overlay returns 43.8% CAGR at a 1.289 Sharpe with a -40.7% max drawdown. Adding the VIX regime exit brings that to 37.3% CAGR, 1.425 Sharpe, and -20.4% max drawdown, roughly halving the drawdown while improving risk-adjusted return, a trade worth making for something trading real money. A separate circuit-breaker layer, calibrated off the strategy's own Monte Carlo distribution rather than arbitrary numbers, halts trading on a genuine regime break rather than ordinary volatility.",
    ],
    exhibits: [
      { img: 'equity-curve.png', caption: 'FIG. 01. MOM_BROAD equity curve and drawdown, with VIX out-of-market periods shaded.' },
      { img: 'platform-ui.png', src: 'swinglab/images/platform_ui.png', caption: 'FIG. 02. SwingLab live: ticker explorer, macro gates, and the live signal feed.' },
    ],
  },

  /* ── 2. GNN thesis ────────────────────────────────────────── */
  {
    id: 'gnn',
    n: '02',
    year: '2026',
    cat: 'ml',
    title: 'Cross-sectional',
    em: 'GNN strategy',
    role: 'Solo · Thesis',
    type: 'Applied research',
    tags: ['PyTorch', 'PyTorch Geometric', 'Fractional diff'],
    blurb: 'Does modeling stocks as a graph beat a simple trend baseline? Tested with 83 quarters of walk-forward validation.',
    featured: true,
    viz: 'graph',
    capText: 'correlation graph · IC 0.051',
    stats: [
      { num: '0.051', label: 'Information coefficient' },
      { num: '1.33', label: 'Sharpe' },
      { num: 'p = 0.007', label: 'Significance' },
    ],
    status: 'Complete, thesis-grade',
    copy: [
      "A thesis-grade project asking one specific, falsifiable question: does modeling how stocks move together as a graph add real predictive value over a simple 200-day moving average trend baseline? Tested on the Nasdaq-100, 2005 to 2025, with 83 quarters of walk-forward validation so there's no lookahead and no single lucky backtest window doing the work.",
      "Each stock is a node. Edges are built from rolling pairwise return correlations, recomputed every quarter as relationships shift. Node features combine multi-lookback momentum, volatility, and fractionally differentiated price series, which keep enough memory of price level to be informative while staying close to stationary. A graph neural network passes information between connected nodes, so a stock's predicted return is shaped by what's happening in the names it's structurally linked to, that's the actual hypothesis under test.",
      "Annualized return came out to 27.3% against the baseline's 25.6%, Sharpe 1.33 versus 1.23, and max drawdown -27.6% versus -36.4%, a meaningfully smaller drawdown for a similar return profile. The Information Coefficient of 0.051 (p = 0.007) confirms the cross-sectional predictive signal is real, not a fluke of one run, and a Fama-French 5-factor plus Momentum regression (t-stat 3.77, p = 0.0002) confirms the outperformance isn't just repackaged exposure to known risk factors.",
    ],
    exhibits: [
      { img: 'fair-comparison.png', caption: 'FIG. 01. Cumulative returns, GNN vs. 200-MA baseline, same universe, no survivorship bias.' },
      { img: 'ic-distribution.png', caption: 'FIG. 02. Information Coefficient distribution and cumulative IC across 83 quarters.' },
    ],
  },

  /* ── 3. Sentify ───────────────────────────────────────────── */
  {
    id: 'sentify',
    n: '03',
    year: '2025',
    cat: 'infra',
    title: 'Sentify',
    em: 'emotion pipeline',
    role: 'Team · Client',
    type: 'MLOps',
    tags: ['FastAPI', 'Airflow', 'MLflow'],
    blurb: 'A media client\u2019s emotion classifier, served on-prem and retrained automatically on real user feedback.',
    featured: true,
    viz: 'waveform',
    capText: '7 classes · retrain loop',
    stats: [
      { num: '0.84', label: 'Macro F1' },
      { num: '7', label: 'Emotion classes' },
      { num: 'Live', label: 'Served on Portainer' },
    ],
    status: 'Live for client, in production',
    copy: [
      "Sentify pulls YouTube videos and comments for a media client (Banijay), transcribes them, and classifies emotion sentence by sentence into seven classes: anger, disgust, fear, happiness, neutral, sadness, surprise. Built to satisfy a full MLOps brief covering deployment, monitoring, explainability, and automated retraining, not just a model that works once in a notebook.",
      "Everything user-facing runs as a Docker Compose stack on a Portainer host: a React/Vite frontend, a FastAPI backend exposing /predict, /feedback, and /jobs, a Streamlit dashboard, and the stateful services behind them, Postgres for analyses and feedback, MinIO for MLflow artifacts. The backend loads the current champion model directly from the MLflow registry, and the Streamlit dashboard reads straight from Postgres, no separate API layer needed for an internal monitoring tool.",
      "Retraining runs separately, as an Airflow DAG on a school server that talks to the backend over HTTP through a fixed sequence: check for new data, prepare feedback, fine-tune, evaluate, register. Real user corrections eventually feed back into a better model on a schedule instead of manually, and MLflow's model registry only promotes a new version if it beats the current champion on macro F1.",
      "A bug worth mentioning: the original setup (WeightedRandomSampler plus weighted cross-entropy, high learning rate) caused confidence collapse, validation F1 sitting around 0.41. Switching to Focal Loss with AdamW at a lower learning rate fixed it, bringing macro F1 up to about 0.84. Explainability runs on Integrated Gradients implemented directly in PyTorch, skipping Captum to avoid an unnecessary dependency for a single use case.",
    ],
    exhibits: [
      { diagram: 'sentify-arch', caption: 'FIG. 01. System architecture: served stack on Portainer vs. the Airflow retraining pipeline.' },
    ],
  },

  /* ── 4. money_dashboard ───────────────────────────────────── */
  {
    id: 'money-dashboard',
    n: '04',
    year: '2026',
    cat: 'infra',
    title: 'money_dashboard',
    em: 'regime cockpit',
    role: 'Solo',
    type: 'Live monitoring tool',
    tags: ['Python', 'yfinance', 'Streamlit'],
    blurb: 'A live market cockpit built to catch regime and trend shifts during the day, honest about its own data limits.',
    featured: true,
    viz: 'candles',
    capText: '~15min delay, always labeled',
    stats: [
      { num: '6', label: 'Pages' },
      { num: '90s', label: 'Auto-refresh' },
      { num: '~15min', label: 'Data delay, always labeled' },
    ],
    status: 'Live, daily use',
    copy: [
      "Backtests and strategy code don't tell you what the market is doing today. money_dashboard exists to answer one question all day long: what's actually happening right now, and is the regime shifting under my feet, breadth thinning under a rally, volatility turning, a sector rotation starting. It's a monitoring cockpit, not a backtester and not an execution tool, on purpose, and deliberately separate from SwingLab.",
      "Built entirely on yfinance: no paid feed, no order flow, no true real-time data. Rather than pretend otherwise, the whole dashboard is built around that limit. Every panel is labeled with exactly how fresh its data is, and buy-versus-sell pressure is estimated with professional proxies (TRIN, up/down volume, breadth) instead of faking tape data that doesn't exist. A session clock tracks market phase (overnight, EU only, overlap, US only), and every page keys off it, showing last close by default and flipping to live intraday only once its relevant market opens.",
      "Six pages cover the day: Overview (sector heatmap, breadth, TRIN, refreshing every 90 seconds off one bulk snapshot across roughly 500 names), Cross-Asset (rotation ratios, badged DAILY where rotation is genuinely a multi-week signal), Macro & Regime (SPY against a composite score, FRED rates, deliberately end-of-day since these signals are supposed to be slow), Volatility (VIX term structure, VVIX, SKEW, DSPX dispersion, degrading gracefully when Yahoo doesn't serve a ticker), Europe (a 09:00 CET view with an overlap panel for the US open), and a TradingView-style Ticker view with regime overlays.",
    ],
    exhibits: [
      { img: 'overview.png', src: 'money-dashboard/images/overview.png', caption: 'FIG. 01. Overview: sector heatmap, breadth, and top gainers/losers.' },
      { img: 'volatility.png', src: 'money-dashboard/images/volatility.png', caption: 'FIG. 02. Volatility desk: VIX term structure, VVIX, SKEW, and DSPX dispersion.' },
      { img: 'macro-regime.png', src: 'money-dashboard/images/macro_regime.png', caption: 'FIG. 03. Macro & Regime: SPY vs. composite score with 7 risk signals.' },
    ],
  },

  /* ── 5. VTSZ / Tarif classifier ───────────────────────────── */
  {
    id: 'vtsz',
    n: '05',
    year: '2025',
    cat: 'research',
    title: 'VTSZ customs',
    em: 'classifier',
    role: 'Client · Solo',
    type: 'Applied vision-language',
    tags: ['Qwen2.5-VL', 'Ollama', 'Streamlit'],
    blurb: 'A local vision-language model replaces a manual Excel and PDF customs-classification workflow.',
    featured: false,
    stats: [
      { num: '100%', label: 'Candidate recall' },
      { num: '58/42', label: 'Final pick split' },
      { num: '480 \u2192 12', label: 'Candidate list, pruned' },
    ],
    status: 'Working prototype',
    copy: [
      "A client (Zoomlion machine parts) was manually classifying products into Hungarian customs codes using a consumer chat tool plus Excel and PDF uploads, slow, and it wasn't even clear whether the client's contracts allowed external APIs to touch this data. This project builds a self-hosted alternative that sidesteps that question entirely.",
      "A local Qwen2.5-VL 7B model, quantized and served through Ollama on a consumer GPU, reads product images pulled from the PDF catalog alongside text fields from the source spreadsheet. For each item it proposes two competing classification scenarios, one machine-specific, one material or function based, and a Streamlit review app lets a customs expert pick between them.",
      "The first version fed the model a candidate list of roughly 480 possible codes per item, and accuracy was bad. Narrowing that list down to the roughly 12 actually relevant codes per item fixed nearly all of it, the model was never the real constraint, the search space was. The model now retrieves the right pair of candidates 100% of the time and picks the correct final code 58% of the time, with its own confidence signal well-calibrated against human corrections, a lead for improving accuracy without retraining anything.",
    ],
    exhibits: [],
  },

  /* ── 6. IMC Prosperity 4 ──────────────────────────────────── */
  {
    id: 'prosperity',
    n: '06',
    year: '2026',
    cat: 'quant',
    title: 'IMC Prosperity 4',
    em: 'solo entry',
    role: 'Solo · Competition',
    type: 'Algorithmic trading',
    tags: ['Python', 'Options', 'Game theory'],
    blurb: 'A global trading competition, 223rd of 18,800 teams solo, 1st in the Netherlands on the manual round.',
    featured: true,
    viz: 'smile',
    capText: 'voucher IV smile · #223 of 18,800',
    stats: [
      { num: '223rd', label: 'of 18,800 teams' },
      { num: '7th', label: 'Netherlands, overall' },
      { num: '1st NL', label: 'Manual round' },
    ],
    status: 'Complete',
    copy: [
      "A global algorithmic trading competition run across timed rounds, mixing an algo trading challenge with separate manual reasoning puzzles each round. I competed solo, against roughly 18,800 teams and over 30,000 participants total, finishing 223rd overall, 7th in the Netherlands overall, and 1st in the Netherlands on the manual challenges (33rd globally).",
      "On the algorithmic side, work centered on pricing voucher options, estimating implied volatility and fitting it to a smile across strikes, then converting deviations from that smile into cross-sectional z-scores to flag mispriced vouchers. A market-making layer balanced quote competitiveness against inventory risk, with a regime-detection layer adjusting behavior as the simulated market's conditions shifted mid-round.",
      "Round 3 was humbling: an overfit algorithm looked incredible on the backtest and fell apart the moment live data arrived. From then on I optimized for strategies that were theoretically sound rather than ones that simply scored highest on a historical curve, which is what drove the results in rounds 4 and 5. For the manual rounds, the assumption was that most competitors would paste the problem into an LLM and run with the first answer, so instead of optimizing for the textbook-correct answer, I modeled what the crowd's likely solution would be and worked out where the real edge sat once everyone else had clustered around it. Against other humans, thinking about what they'll do beats pure optimization.",
    ],
    exhibits: [
      { img: 'leaderboard.jpg', caption: 'FIG. 01. Final leaderboard: #223 overall, #7 country, #33 manual globally.' },
    ],
  },

  /* ── 7. NPEC ───────────────────────────────────────────────── */
  {
    id: 'npec',
    n: '07',
    year: '2025',
    cat: 'research',
    title: 'NPEC',
    em: 'root pred + robot arm',
    role: 'Research collab',
    type: 'Computer vision · Robotics',
    tags: ['PyTorch', 'U-Net', 'Dijkstra', 'SAC/PPO'],
    blurb: 'A U-Net root segmentation pipeline feeding a Dijkstra length measurement, then an RL-controlled robot arm for automated inoculation.',
    featured: true,
    viz: 'roots',
    capText: 'U-Net → Dijkstra → OT-2 arm',
    stats: [
      { num: 'U-Net', label: 'Root segmentation' },
      { num: 'Dijkstra', label: 'Root length pathfinding' },
      { num: 'SAC/PPO', label: 'OT-2 arm control' },
    ],
    status: 'Complete, research collaboration',
    copy: [
      "Work with the Netherlands Plant Eco-phenotyping Centre (Utrecht) on an end-to-end pipeline: predict a plant's root system from a raw plate photo, measure it accurately, then use that to drive a robot arm that automates inoculation. Three separate problems chained together, each one had to actually work before the next made sense.",
      "The first stage is segmentation: a U-Net trained on plate images of Arabidopsis seedlings predicts a binary root mask from the raw grayscale photo, isolating the thin, branching root structure from a noisy background of condensation, plate edges, and shadows. The second stage takes that mask and measures it properly: rather than a crude pixel count, root length is computed via Dijkstra pathfinding along the skeletonized mask, tracing the actual path from the root tip down to its furthest branch. Validated per-plant, it correctly measured lengths from 611 to over 1300 pixels across a real test batch, and just as importantly, correctly returned zero for a plant where no root was visible instead of guessing.",
      "The third stage closes the loop: reinforcement learning, starting from a PID baseline and moving to SAC/PPO, controls an OT-2 lab robot to automate the inoculation process itself, informed by the root measurements from the first two stages, aiming to cut manual lab work while keeping inoculation accuracy high.",
    ],
    exhibits: [
      { img: 'segmentation-prediction.png', caption: 'FIG. 01. U-Net segmentation: raw plate photo (left) vs. predicted root mask (right), three seedlings.' },
      { img: 'root-length-measurements.png', caption: 'FIG. 02. Dijkstra root length measurement per plant, with a correctly-rejected no-root case.' },
    ],
  },

  /* ── 8. Waste Classifier (archive only) ───────────────────── */
  {
    id: 'waste-classifier',
    n: '08',
    year: '2024',
    cat: 'ml',
    title: 'Waste Classifier',
    em: 'WasteWarrior',
    role: 'Solo',
    type: 'Applied computer vision',
    tags: ['TensorFlow', 'Flask', 'MobileNet', 'GCP'],
    blurb: 'Sorting trash with 97.7% accuracy, wrapped in a full deployed app, not just a notebook model.',
    featured: false,
    stats: [
      { num: '97.7%', label: 'Test accuracy' },
      { num: 'MobileNet', label: 'Backbone' },
      { num: 'Live', label: 'On GCP' },
    ],
    status: 'Deployed',
    copy: [
      "A full-stack deep learning application that classifies waste images to support correct sorting and recycling, built to be a complete deployable product rather than a model that only lives in a notebook. A user either photographs an item through a phone-style camera interface or uploads one from their device, and the app returns the predicted waste type along with a colour-coded bin, blue for paper, yellow for plastic, and so on, so the disposal decision is immediate.",
      "Two models sit behind the /predict route. The first is a custom CNN, three convolutional blocks with batch normalization and dropout, trained on both the original and an augmented dataset: it reaches 76.8% accuracy on the original data and 69.4% under the harder augmented set of rotations and distortions. The second is a MobileNet backbone fine-tuned via transfer learning on ImageNet weights, which lifts test accuracy to 97.7% with strong precision and recall across every category and only rare, genuinely ambiguous misclassifications.",
      "Around the model is a real application: a Flask backend with SQLAlchemy over SQLite, session-based accounts through Flask-Login with bcrypt-hashed passwords and full register / login / logout flows, and a clean HTML, CSS, and JavaScript frontend that holds up across devices. Model development leaned on TensorFlow/Keras and scikit-learn, with NumPy, Matplotlib, and Seaborn doing the data analysis and evaluation.",
    ],
    exhibits: [
      { img: 'prediction.jpg', caption: 'FIG. 01. Prediction result: Paper_Cardboard, with disposal guidance.' },
    ],
  },

  /* ── 9. DeckDoctor ────────────────────────────────────────── */
  {
    id: 'deckdoctor',
    n: '09',
    year: '2025',
    cat: 'side',
    title: 'DeckDoctor',
    em: 'hackathon build',
    role: 'Solo · Hackathon',
    type: 'Applied ML · Side',
    tags: ['React', 'FastAPI', 'GPT', 'ElevenLabs'],
    blurb: 'A Clash Royale deck analyzer built at Supercell\u2019s hackathon, with a spoken analysis.',
    featured: false,
    stats: [
      { num: 'Hackathon', label: 'Supercell' },
      { num: 'GPT', label: 'Deck analysis' },
      { num: 'Voice', label: 'ElevenLabs TTS' },
    ],
    status: 'Complete',
    copy: [
      "Built during Supercell's Clash Royale hackathon: a tool that pulls a player's deck through the Clash Royale API, analyzes its strengths and weaknesses using GPT-based reasoning, and reads the analysis back out loud through ElevenLabs text-to-speech.",
    ],
    exhibits: [
      { placeholder: true, caption: 'FIG. 01. DeckDoctor analysis output. Image pending.' },
    ],
  },

  /* ── 10. OCR & LLM receipt extraction ─────────────────────── */
  {
    id: 'ocr-receipts',
    n: '10',
    year: '2025',
    cat: 'ml',
    title: 'Receipt extraction',
    em: 'OCR + LLM',
    role: 'Solo',
    type: 'Applied ML pipeline',
    tags: ['Tesseract', 'Llama'],
    blurb: 'Turning messy scanned receipts into clean structured data, no manual retyping.',
    featured: false,
    stats: [
      { num: 'Tesseract', label: 'OCR pass' },
      { num: 'Llama', label: 'Structuring' },
      { num: 'Jun\u2013Sep 2025', label: 'Built' },
    ],
    status: 'Complete',
    copy: [
      "Manually entering data from scanned receipts is slow and error-prone, especially when scans are low quality, skewed, or faded. This pipeline reads a scanned receipt and returns clean, structured data automatically.",
      "Tesseract handles the raw OCR pass, pulling text out of the image even when quality is poor. That messy raw output is then passed to a Llama model, which cleans it up and structures it into the fields that matter (items, prices, totals, dates), correcting the kind of OCR noise that would trip up a purely rule-based parser.",
    ],
    exhibits: [
      { img: 'ocr_llm.png', caption: 'FIG. 01. Pipeline: raw OCR text vs. the cleaned, structured result.' },
    ],
  },

  /* ── 11. AI Engineer Internship ───────────────────────────── */
  {
    id: 'internship',
    n: '11',
    year: '2025',
    cat: 'infra',
    title: 'AI Engineer',
    em: 'internship',
    role: 'Internship',
    type: 'Production ML',
    tags: ['FastAPI', 'LLaMA', 'GCP', 'Firebase', 'Unity'],
    blurb: 'RAG, a custom LLaMA model, and an interactive avatar, live to real users.',
    featured: false,
    stats: [
      { num: 'RAG', label: 'System type' },
      { num: 'GCP', label: 'Cloud Run + Firebase' },
      { num: 'Unity', label: 'Demo layer' },
    ],
    status: 'Jun 2025 \u2013 Jun 2026',
    copy: [
      "An AI engineering internship at AIGENTIC Compliance, building a production Retrieval-Augmented Generation system with an interactive avatar interface, wiring a custom LLaMA model together with external APIs behind it.",
      "The application is full-stack: a FastAPI backend and JavaScript frontend with hardened security and robust API integrations, deployed across Google Cloud Run and Firebase. I worked with a senior engineer to slot a complex proxy system into the existing infrastructure, and shipped a Unity demo game that showcases the product to users.",
      "Alongside the core system I built a monitoring dashboard tracking user interactions, API calls, and performance across both the site and the app, and helped update the company website so the RAG system and its interactive features integrate seamlessly.",
    ],
    exhibits: [],
  },
];

/* Convenience lookups used across pages */
const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);
