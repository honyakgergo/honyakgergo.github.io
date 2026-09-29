/* ══════════════════════════════════════════════════════════════
   Single source of truth for every project: used by the home
   page (featured subset), the archive (full list + filtering),
   and the project detail page template.

   Image paths point to assets/images/<slug>/<file>. Drop the
   matching source screenshot into that folder under that exact
   name and it will appear automatically, no HTML edits needed.
   ══════════════════════════════════════════════════════════════ */

const CAT_LABEL = { ml: 'Machine Learning', quant: 'Quant', infra: 'Infra ∙ Platform', research: 'Research', side: 'Side' };

const PROJECTS = [

  /* ── 1. MOM_BROAD ─────────────────────────────────────────── */
  {
    id: 'swinglab',
    n: '01',
    year: '2026',
    cat: 'quant',
    title: 'MOM_BROAD',
    em: 'momentum strategy',
    role: 'Solo ∙ Live',
    type: 'Systematic equity strategy',
    tags: ['Python', 'pandas', 'NumPy', 'yfinance'],
    blurb: 'A weekly cross-sectional momentum strategy on US large caps, trading real capital since February 2026.',
    featured: true,
    viz: 'equity',
    capText: 'VIX exit 25 / re-entry 20',
    stats: [
      { num: '34.7%', label: 'CAGR, backtest since 2016' },
      { num: '1.27', label: 'Sharpe, backtest' },
      { num: '1.59', label: 'Sharpe, live 2026' },
    ],
    status: 'Live, trading real capital',
    copy: [
      "MOM_BROAD ranks about 515 US large caps, the S&P 500 plus the rest of the Nasdaq-100, by 189-day return in excess of SPY, skipping the last month. A name only enters if it is in a bull regime, its RSI is at most 70, and at least two of three trend signals agree: a Carver EWMAC blend, MACD and Supertrend. It holds the top 7 equal weight, at most 3 per sector, rebalanced weekly, with no new entries when a 7-part macro score turns risk-off.",
      "It got simpler as it matured. The first version picked tickers with a Boruta filter fitted on the full sample; rebuilt walk-forward, the filter kept 514 of 515 names, so it went. Volatility-based sizing, Carver sizing and an HMM regime model were each tested against equal weight and a plain VIX rule, and none earned its complexity.",
      "Going live exposed what the backtest hid. yfinance re-adjusts history on every dividend, so replaying the backtest changed my holdings between runs; the live runner now trades from a state file of real fills. The backtest's VIX exit resumes the old book, which live trading cannot, so that Sharpe is slightly optimistic. And one morning a price bar with no closes nearly sold the whole book, so missing data now counts as unknown, never as a sell signal.",
      "Backtested daily from December 2016, it returns 34.7% CAGR at a 1.27 Sharpe with a -21.2% max drawdown. Live since February 2026 it is up 51.8% at a 1.59 Sharpe. Both come with caveats: the universe is today's index members, which flatters momentum, and seven months live is not evidence.",
    ],
    exhibits: [
      { img: 'equity-curve.png', caption: 'FIG. 01. Daily equity and drawdown, with out-of-market periods and the live stretch shaded.' },
    ],
  },

  /* ── 2. GNN ───────────────────────────────────────────────── */
  {
    id: 'gnn',
    n: '02',
    year: '2026',
    cat: 'ml',
    title: 'Cross-sectional',
    em: 'GNN strategy',
    role: 'Solo ∙ Research',
    type: 'Applied research',
    tags: ['Python', 'PyTorch', 'PyTorch Geometric', 'pandas'],
    blurb: 'Does modelling stocks as a graph beat a simple trend baseline? 83 quarters of walk-forward say: not significantly.',
    featured: true,
    viz: 'graph',
    capText: 'correlation graph ∙ IC 0.051',
    stats: [
      { num: '0.051', label: 'Information coefficient' },
      { num: 't = 2.77', label: 'IC significance' },
      { num: 't = 0.37', label: 'Alpha vs momentum' },
    ],
    status: 'Complete',
    copy: [
      "My first quant project, with one question: does modelling how stocks move together as a graph add predictive value over a 200-day moving-average momentum baseline? Tested on the Nasdaq-100 over 83 walk-forward quarters, 2005 to 2025, retraining every quarter on the previous ten years.",
      "Each stock is a node, connected to others where their ten-year return correlation is at least 0.3, and the graph is rebuilt every quarter. Features are selected each quarter by information coefficient on training data only. A three-layer graph convolutional network predicts the next quarter's return, and the portfolio holds the top 10 positive predictions.",
      "The signal is real but weak: a mean IC of 0.051 (t = 2.77). Against the momentum baseline on the same universe it returns 27.3% a year against 25.6%, with a smaller drawdown, but the 1.7% alpha is nowhere near significant (t = 0.37). The universe is today's index members, so every absolute number is inflated by survivorship; the same-universe baseline is the only fair comparison.",
    ],
    exhibits: [
      { img: 'fair-comparison.png', caption: 'FIG. 01. GNN against the 200-day MA baseline, same universe and filters.' },
      { img: 'ic-distribution.png', caption: 'FIG. 02. Information coefficient per quarter and cumulative, 83 quarters.' },
    ],
  },

  /* ── 3. proper_validation ─────────────────────────────────── */
  {
    id: 'proper-validation',
    n: '03',
    year: '2026',
    cat: 'quant',
    title: 'proper_validation',
    em: 'backtest validator',
    role: 'Solo ∙ Open source',
    type: 'Quant research tooling',
    tags: ['Python', 'SciPy', 'statsmodels', 'pytest'],
    blurb: 'An adversarial validator that attacks a finished backtest and reports how much of the claimed edge survives.',
    featured: false,
    stats: [
      { num: '96%', label: 'Planted defects caught' },
      { num: '0%', label: 'False positives on a real edge' },
      { num: '1,075', label: 'Tests, 97% coverage' },
    ],
    status: 'Complete, open source',
    copy: [
      "Backtest engines are mature and free, and none of them tell you whether the result means anything. proper_validation takes a backtest you have already run and attacks it. It can falsify a strategy but never validate one: the best verdict is NOT_FALSIFIED.",
      "It gives two separate verdicts. The statistical one asks whether the edge beats luck: deflated Sharpe against a best-of-N null, probability of backtest overfitting, Fama-French 5 plus momentum attribution, cost fragility, and survivorship counted against real index membership. The engine one asks whether the code can be trusted: it destroys every price after a cut point, re-runs the strategy and checks that no earlier decision changed, which catches leaks inside library calls.",
      "A careful dual momentum strategy shows why. It beats the S&P 500 on Sharpe and the engine finds nothing wrong, yet the alpha is momentum exposure, PBO is 59%, and a claimed Sharpe of 0.67 falls to 0.31 after honest accounting. Across nine labelled benchmark strategies it catches 96% of planted defects with 0% false positives on the real edge.",
    ],
    exhibits: [
      { img: 'haircut_cascade.png', caption: 'FIG. 01. A claimed Sharpe of 0.67, after each honest adjustment.' },
      { img: 'pbo_panel.png', caption: 'FIG. 02. Probability of backtest overfitting across 12,870 splits.' },
    ],
  },

  /* ── 4. Sentify ───────────────────────────────────────────── */
  {
    id: 'sentify',
    n: '04',
    year: '2025',
    cat: 'infra',
    title: 'Sentify',
    em: 'emotion pipeline',
    role: 'Team ∙ Client',
    type: 'MLOps',
    tags: ['FastAPI', 'React', 'Airflow', 'MLflow', 'Docker', 'Postgres'],
    blurb: 'A media client’s emotion classifier, served on-prem and retrained automatically on real user feedback.',
    featured: true,
    viz: 'waveform',
    capText: '7 classes ∙ retrain loop',
    stats: [
      { num: '0.84', label: 'Macro F1' },
      { num: '7', label: 'Emotion classes' },
      { num: '210+', label: 'Tests, 95% coverage' },
    ],
    status: 'Complete, team project',
    copy: [
      "A team MLOps project for Banijay Benelux: give it a video or audio clip and it returns a transcript with an emotion label for every sentence, across seven classes. The brief was everything around the model: packaging, serving, monitoring and automated retraining.",
      "The model is a fine-tuned BERT. The first setup, a weighted sampler with weighted cross-entropy at a high learning rate, collapsed into low-confidence predictions at macro F1 0.41. Focal loss with AdamW at a lower learning rate fixed it, reaching 0.84. Integrated gradients show which words drove each prediction.",
      "The same package and containers run in two places. Azure ML handles GPU training and sweeps, with a gate that only registers a model if it beats the current one. On-premise, a Docker Compose stack serves a React frontend, a FastAPI backend, a Streamlit dashboard, MLflow, Postgres and MinIO, and an Airflow DAG retrains on user corrections.",
    ],
    exhibits: [
      { diagram: 'sentify-arch', caption: 'FIG. 01. The served stack on Portainer and the Airflow retraining loop.' },
    ],
  },

  /* ── 5. volatility_dashboard ──────────────────────────────── */
  {
    id: 'volatility-dashboard',
    n: '05',
    year: '2026',
    cat: 'infra',
    title: 'volatility_dashboard',
    em: 'regime cockpit',
    role: 'Solo',
    type: 'Live monitoring tool',
    tags: ['FastAPI', 'React', 'yfinance', 'SQLite', 'Plotly'],
    blurb: 'The screen I keep open while the market runs: breadth, rotation, the vol complex, weekly positioning and per-name research.',
    featured: true,
    viz: 'candles',
    capText: '~15min delay, always labeled',
    stats: [
      { num: '10', label: 'Pages' },
      { num: 'Daily', label: 'What I actually read it on' },
      { num: '~15min', label: 'Data delay, always labeled' },
    ],
    status: 'Live, daily use',
    copy: [
      "Backtests don't tell you what the market is doing today. This is the screen I read every morning and through the session, and mostly it is how I learn the market: I form a view of the day from the numbers, then work out the odd parts, like why credit is widening while equities hold.",
      "Ten pages cover the day: breadth across 500 names, a Relative Rotation Graph against SPY, a macro score from FRED, the volatility complex, commodities built around roll yield, and weekly positioning from the CFTC and the NAAIM survey. Every level comes with its percentile, because VIX 18 is calm in one year and a warning in another. The Ticker page is where a trade gets checked before I take it: fundamentals, earnings, analyst targets and options signals next to the chart.",
      "It runs on free data, so every panel says how fresh it is, and anything the feed does not serve is shown as unavailable instead of invented.",
    ],
    exhibits: [
      { img: 'cross-asset-rrg.png', caption: 'FIG. 01. Cross-Asset: the Relative Rotation Graph against SPY, with the correlation matrix.' },
      { img: 'ticker-research.png', caption: 'FIG. 02. Ticker: full price history with analyst, earnings and options signals.' },
    ],
  },

  /* ── 6. VTSZ / Tarif classifier ───────────────────────────── */
  {
    id: 'vtsz',
    n: '06',
    year: '2025',
    cat: 'research',
    title: 'VTSZ customs',
    em: 'classifier',
    role: 'Client ∙ Solo',
    type: 'Applied vision-language',
    tags: ['Python', 'Qwen2.5-VL', 'Ollama', 'Streamlit'],
    blurb: 'A local vision-language model replaces a manual Excel and PDF customs-classification workflow.',
    featured: false,
    stats: [
      { num: '100%', label: 'Correct code in top 2' },
      { num: '58%', label: 'Correct first pick' },
      { num: '480 → 12', label: 'Candidate codes, pruned' },
    ],
    status: 'Working prototype',
    copy: [
      "A machine-parts client (Zoomlion) classified products into Hungarian customs codes by hand, with a consumer chatbot plus Excel and PDF uploads. It was slow, and it was unclear whether their contracts even allowed the data to reach an external API. A self-hosted model removes that question.",
      "Qwen2.5-VL 7B, quantised and served through Ollama on a consumer GPU, reads product images from the PDF catalogue alongside the spreadsheet fields. For each item it proposes two scenarios, one machine-specific and one based on material or function, and a Streamlit app lets a customs expert pick.",
      "The first version gave the model about 480 candidate codes per item and accuracy was poor. Cutting that to the 12 or so relevant codes fixed most of it: the search space was the problem, not the model. The right code is now always among the two scenarios, and the first pick is correct 58% of the time.",
    ],
    exhibits: [],
  },

  /* ── 7. IMC Prosperity 4 ──────────────────────────────────── */
  {
    id: 'prosperity',
    n: '07',
    year: '2026',
    cat: 'quant',
    title: 'IMC Prosperity 4',
    em: 'solo entry',
    role: 'Solo ∙ Competition',
    type: 'Algorithmic trading',
    tags: ['Python', 'NumPy', 'pandas'],
    blurb: 'A global trading competition, 223rd of 18,800 teams solo, 1st in the Netherlands on the manual round.',
    featured: true,
    viz: 'smile',
    capText: 'voucher IV smile ∙ #223 of 18,800',
    stats: [
      { num: '223rd', label: 'of 18,800 teams' },
      { num: '7th', label: 'Netherlands, overall' },
      { num: '1st NL', label: 'Manual round' },
    ],
    status: 'Complete',
    copy: [
      "A global algorithmic trading competition, each round pairing an algo challenge with a manual puzzle. I entered solo against roughly 18,800 teams and finished 223rd overall, 7th in the Netherlands, and 1st in the Netherlands on the manual rounds (33rd globally).",
      "On the algo side I priced voucher options by fitting implied volatility to a smile across strikes and trading deviations from it as z-scores, with a market-making layer that balanced quote competitiveness against inventory risk.",
      "Round 3 taught me the most: an algorithm that looked excellent on the backtest fell apart on live data. After that I chose strategies that made theoretical sense over ones that scored best on history. For the manual rounds I assumed most players would take an LLM's first answer, so I modelled where the crowd would cluster and positioned against it.",
    ],
    exhibits: [
      { img: 'leaderboard.jpg', caption: 'FIG. 01. Final leaderboard: #223 overall, #7 country, #33 manual globally.' },
    ],
  },

  /* ── 8. NPEC ───────────────────────────────────────────────── */
  {
    id: 'npec',
    n: '08',
    year: '2025',
    cat: 'research',
    title: 'NPEC',
    em: 'root pred + robot arm',
    role: 'Research collab',
    type: 'Computer vision ∙ Robotics',
    tags: ['Python', 'PyTorch', 'U-Net', 'Dijkstra', 'SAC/PPO'],
    blurb: 'A U-Net root segmentation pipeline feeding a Dijkstra length measurement, then a controlled robot arm for automated inoculation.',
    featured: true,
    viz: 'roots',
    capText: 'U-Net → Dijkstra → OT-2 arm',
    stats: [
      { num: '< 1 mm', label: 'Robot positioning error' },
      { num: 'p < 0.001', label: 'Inpainting study, 9,014 patches' },
      { num: '4-class', label: 'U-Net segmentation' },
    ],
    status: 'Complete, research collaboration',
    copy: [
      "Work with the Netherlands Plant Eco-phenotyping Centre on Arabidopsis roots: from a raw plate photo to a robot arm that inoculates each plant at its root tip.",
      "A U-Net segments roots, seeds and shoots from the plate image. The root mask is skeletonised and Dijkstra traces the longest path from the tip, which gives both the root length and the exact point the robot needs; on a test batch it measured 611 to over 1,300 pixel roots and correctly returned zero for a plant with no root. A tuned PID controller then drives the OT-2 arm to each tip with under 1 mm error, and an RL controller (SAC/PPO) was trained as an alternative.",
      "A follow-up study asked whether a learned model repairs gaps in root masks better than classical image processing. A U-Net with BCE loss beat Dice loss, morphological closing and a graph method on all three gap metrics, at p < 0.001 across 9,014 test patches.",
    ],
    exhibits: [
      { img: 'segmentation-prediction.png', caption: 'FIG. 01. U-Net segmentation: raw plate photo and predicted root mask.' },
      { img: 'root-length-measurements.png', caption: 'FIG. 02. Root length per plant, with the no-root case correctly rejected.' },
    ],
  },

  /* ── 9. Waste Classifier (archive only) ───────────────────── */
  {
    id: 'waste-classifier',
    n: '09',
    year: '2024',
    cat: 'ml',
    title: 'Waste Classifier',
    em: 'WasteWarrior',
    role: 'Solo',
    type: 'Applied computer vision',
    tags: ['Python', 'TensorFlow', 'Flask', 'SQLite'],
    blurb: 'Sorting waste photos with 97.7% accuracy, inside a full Flask app rather than a notebook.',
    featured: false,
    stats: [
      { num: '97.7%', label: 'Test accuracy' },
      { num: 'MobileNet', label: 'Backbone' },
      { num: '3', label: 'Explainability methods' },
    ],
    status: 'Complete',
    copy: [
      "My first-year deep learning project: photograph a piece of waste and the app returns its type and the right colour-coded bin.",
      "A custom CNN trained from scratch reached 76.8%. MobileNet transfer learning from ImageNet weights reached 97.7%, with the few errors on genuinely ambiguous items. Grad-CAM, LIME and integrated gradients confirmed the model looks at the object, not the background.",
      "Around it sits a Flask app with a /predict route, SQLite storage, bcrypt-hashed accounts and a phone-style camera interface, refined with a small A/B test and think-aloud sessions.",
    ],
    exhibits: [
      { img: 'prediction.jpg', caption: 'FIG. 01. Prediction result: Paper_Cardboard, with disposal guidance.' },
    ],
  },

  /* ── 10. Clash Analyzer ──────────────────────────────────── */
  {
    id: 'clash',
    n: '10',
    year: '2026',
    cat: 'side',
    title: 'Clash Analyzer',
    em: 'battle analytics',
    role: 'Solo ∙ Side',
    type: 'Analytics dashboard',
    tags: ['FastAPI', 'React', 'TypeScript', 'SQLite'],
    blurb: 'A Clash Royale progress tracker and battle-analytics dashboard, with a Wilson interval on every rate.',
    featured: false,
    stats: [
      { num: '95%', label: 'Wilson interval on every rate' },
      { num: 'Top 100', label: 'Meta, crawled daily' },
      { num: '112', label: 'Backend tests, 95% coverage' },
    ],
    status: 'Complete',
    copy: [
      "A side project on the official Clash Royale API. The API only remembers the last 30 or so battles, so a background poller stores every battle and profile snapshot, and history builds up over time.",
      "From that history it computes what the game never shows: tilt after wins and losses, session fatigue, levels against skill, nemesis cards and the best time to play. An upgrade planner works out the gold and copies a deck needs, and a daily crawl of the top 100 players shows how your cards perform at the top.",
      "Every rate carries a 95% Wilson interval, and an insight only appears once the sample can support it. FastAPI and SQLite behind a strict TypeScript React frontend, tested against recorded real API responses.",
    ],
    exhibits: [
      { img: 'overview.png', caption: 'FIG. 01. Player overview: profile, current deck, insights and ranked history.' },
      { img: 'battles.png', caption: 'FIG. 02. Battle analytics: tilt, fatigue, levels against skill, nemesis cards.' },
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
    tags: ['FastAPI', 'Llama', 'GCP Cloud Run', 'Firebase', 'CI/CD'],
    blurb: 'A production RAG assistant on a self-hosted Llama model, deployed on Google Cloud and live to real users.',
    featured: false,
    stats: [
      { num: 'RAG', label: 'Self-hosted Llama' },
      { num: 'Cloud Run', label: 'Scales to zero overnight' },
      { num: '12 mo', label: 'In production' },
    ],
    status: 'Jun 2025 – Jun 2026',
    copy: [
      "A year as an AI engineer intern at AIGENTIC Compliance, building a retrieval-augmented assistant on a self-hosted Llama 3 model, live to real users.",
      "The model runs in a container on GCP Cloud Run, tuned for low latency and set to scale to zero during night hours so it costs nothing when nobody is using it. With a senior engineer I built a proxy API that routes requests between the frontend, the model and external services, and fitted it into the existing infrastructure. Every change goes through a CI/CD pipeline that runs the tests and linting before it builds and deploys.",
      "I also built a monitoring dashboard on GCP that queries the stored user data, tracking interactions, API calls and performance across the website and the app.",
    ],
    exhibits: [],
  },
];

/* ── Longer write-ups on GitHub ────────────────────────────────
   The bigger projects each have their own folder in the GitHub portfolio repo
   with a fuller README and the figures that go with it. Mapped here rather
   than as a field on each project, because the folder names came first and
   only some of them match the ids used on this site: the dashboard's folder is
   still `money-dashboard`, and `GNN project` has a space in it, which has to
   arrive percent-encoded or GitHub 404s. Every project on the site now has a
   folder; one added later without a folder simply gets no link, `repo` stays
   undefined and the template skips it. */
const REPO_BASE = 'https://github.com/honyakgergo/Portfolio/tree/main/';
const REPO_FOLDER = {
  'swinglab':              'swinglab',
  'gnn':                   'GNN%20project',
  'sentify':               'sentify-emotion-pipeline',
  'volatility-dashboard':  'money-dashboard',
  'npec':                  'npec-root-analysis',
  'waste-classifier':      'waste-warrior',
  'proper-validation':     'proper-validation',
  'clash':                 'clash-analyzer',
  'vtsz':                  'vtsz-customs-classifier',
  'prosperity':            'imc-prosperity-4',
  'internship':            'ai-engineer-internship',
};
PROJECTS.forEach(p => { if (REPO_FOLDER[p.id]) p.repo = REPO_BASE + REPO_FOLDER[p.id]; });

/* ── Card covers ──────────────────────────────────────────────
   The home deck and the archive show each project as a picture of the work
   rather than a colour field. Every cover is a 3:2 crop at
   assets/images/<id>/cover.webp, cut from that project's screenshots in the
   GitHub portfolio repo; white-background charts are flipped to dark so they
   sit in the page. Projects with nothing to show keep the colour field. */
const HAS_COVER = ['swinglab', 'gnn', 'proper-validation', 'sentify', 'volatility-dashboard',
  'prosperity', 'npec', 'waste-classifier', 'clash'];
PROJECTS.forEach(p => { if (HAS_COVER.includes(p.id)) p.cover = `/assets/images/${p.id}/cover.webp`; });

/* Convenience lookups used across pages */
const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);
