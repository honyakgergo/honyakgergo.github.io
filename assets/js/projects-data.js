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

  /* ── 1. SwingLab / MOM_BROAD ─────────────────────────────── */
  {
    id: 'swinglab',
    n: '01',
    year: '2026',
    cat: 'quant',
    title: 'SwingLab',
    em: 'and MOM_BROAD',
    role: 'Solo ∙ Live',
    type: 'Quant research platform',
    tags: ['Python', 'FastAPI', 'React', 'SQLite'],
    blurb: 'A full research platform, backtester, and monitor, currently trading real capital through a weekly momentum strategy.',
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
      "SwingLab is the largest thing I've built, a full quantitative research and trading platform, not just a single strategy script. It's where every strategy I design gets built, backtested, stress-tested, and eventually deployed, and it's also the platform currently trading my own capital live through MOM_BROAD.",
      "It's a proper application: a FastAPI backend handles data ingestion, indicator computation, and backtest execution, and a React frontend is the analysis workspace on top of it, drawing moving averages, Bollinger Bands, RSI, and running any strategy against history with full trade logging and drawdown breakdowns. SQLite was a deliberate choice here, not a default: for a single-user research platform running local backtests, a full server database adds latency for no benefit, and SQLite gives fast reads and writes with zero setup cost.",
      "The strategy currently running inside it is MOM_BROAD, a weekly cross-sectional momentum strategy trading a combined S&P 500 + QQQ universe. Stocks are ranked by 189-day relative strength, filtered through a walk-forward Boruta permutation test that checks whether a ticker's signal actually beats random shuffles of itself, then gated by a bull-regime check and a 3-vote indicator system (EWMAC, MACD, Supertrend) requiring at least 2 of 3 to agree before entry. The top 7 survivors are held equal-weight, sector-capped at 3 per GICS sector, with a VIX regime overlay that steps the whole book to cash above VIX 25 and back in below VIX 20.",
      "Backtested daily from December 2016, the full system returns 34.7% CAGR at a 1.27 Sharpe with a -21.2% max drawdown. The VIX exit is what keeps that drawdown to roughly half of what plain equal-weight momentum suffers, a trade worth making for something trading real money. Live since February 2026 the account is up 51.8% at a 1.59 Sharpe, a short sample but a real one. A separate circuit-breaker layer, calibrated off the strategy's own Monte Carlo distribution rather than arbitrary numbers, halts trading on a genuine regime break rather than ordinary volatility.",
    ],
    exhibits: [
      { img: 'equity-curve.png', caption: 'FIG. 01. MOM_BROAD daily equity and drawdown, with out-of-market periods and the live stretch shaded.' },
      { img: 'platform-ui.png', caption: 'FIG. 02. SwingLab live: ticker explorer, macro gates, and the live signal feed.' },
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
    role: 'Solo ∙ Thesis',
    type: 'Applied research',
    tags: ['Python', 'PyTorch', 'PyTorch Geometric', 'pandas'],
    blurb: 'Does modeling stocks as a graph beat a simple trend baseline? Tested with 83 quarters of walk-forward validation.',
    featured: true,
    viz: 'graph',
    capText: 'correlation graph ∙ IC 0.051',
    stats: [
      { num: '0.051', label: 'Information coefficient' },
      { num: '1.33', label: 'Sharpe' },
      { num: 'p = 0.007', label: 'Significance' },
    ],
    status: 'Complete, thesis-grade',
    copy: [
      "A thesis-grade project asking one specific, falsifiable question: does modeling how stocks move together as a graph add real predictive value over a simple 200-day moving average trend baseline? Tested on the Nasdaq-100, 2005 to 2025, with 83 quarters of walk-forward validation so there's no lookahead and no single lucky backtest window doing the work.",
      "Each stock is a node. Edges are built from rolling pairwise return correlations, recomputed every quarter as relationships shift. Node features combine multi-lookback momentum, volatility, and fractionally differentiated price series, which keep enough memory of price level to be informative while staying close to stationary. A graph neural network passes information between connected nodes, so a stock's predicted return is shaped by what's happening in the names it's structurally linked to, that's the actual hypothesis under test.",
      "Annualized return came out to 27.3% against the baseline's 25.6%, Sharpe 1.33 versus 1.23, and max drawdown -27.6% versus -36.4%, a meaningfully smaller drawdown for a similar return profile. The Information Coefficient of 0.051 (p = 0.007) confirms the cross-sectional predictive signal is real, not a fluke of one run. Against QQQ itself it earns a 9.48% annualized alpha (t = 2.80, p = 0.005), though that benchmark carries survivorship bias, which is why the same-universe 200-MA test is the fair one.",
    ],
    exhibits: [
      { img: 'fair-comparison.png', caption: 'FIG. 01. Cumulative returns, GNN vs. 200-MA baseline, same universe, no survivorship bias.' },
      { img: 'ic-distribution.png', caption: 'FIG. 02. Information Coefficient distribution and cumulative IC across 83 quarters.' },
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
    role: 'Solo \u2219 Open source',
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
      "Backtest engines are mature and free, and none of them tell you whether the result means anything. proper_validation asks that question. It takes a backtest you have already run, assumes the arithmetic is right and attacks everything else, then reports how much of the claimed edge survives. It can falsify a strategy but never validate one: there is deliberately no PASSED verdict, the best available is NOT_FALSIFIED.",
      "It gives two separate verdicts. The statistical one asks whether the edge is distinguishable from luck: a deflated Sharpe against a simulated best-of-N null, the probability of backtest overfitting, Fama-French 5 plus momentum attribution, cost fragility from measured turnover, and survivorship counted against real index membership. The engine one asks whether the backtest can be trusted as code. Its look-ahead test destroys every price after a cut point, re-runs the strategy and checks that no earlier decision changed, which catches leaks inside library calls that no linter can reach.",
      "A careful dual momentum strategy shows why the verdicts are kept apart. It beats the S&P 500 on Sharpe and halves its worst drawdown, and the engine finds nothing wrong. The statistics still mark it materially weakened: the alpha is momentum exposure you could buy directly, PBO is 59.1%, and a claimed Sharpe of 0.67 falls to 0.31 once cash, autocorrelation, costs and multiple testing are counted.",
      "Detection rates are measured, not asserted. Across nine labelled benchmark strategies with known edges it catches 96% of the planted defects, with 0% false positives on the one real edge. It ships as a CLI and a Claude Code skill.",
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
    blurb: 'A media client\u2019s emotion classifier, served on-prem and retrained automatically on real user feedback.',
    featured: true,
    viz: 'waveform',
    capText: '7 classes ∙ retrain loop',
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
      "Backtests don't tell you what the market is doing today. This answers one question all day long: what is actually happening right now, and is the regime shifting under my feet. Breadth thinning under a rally, volatility turning, a rotation starting. A monitoring cockpit, not a backtester, and deliberately separate from SwingLab.",
      "Mostly it is how I learn the market. I read it every morning and through the session, form a view of what kind of day it is, then talk the odd parts through with Claude: why credit is widening while equities hold, why the vol curve is backwardated on a green day. Having the numbers in front of me while I ask means the answer lands on something concrete, and a year of that has given me a far clearer picture of how the pieces fit together than commentary ever did.",
      "Ten pages cover the day. Breadth and a sector heatmap across 500 names. A Relative Rotation Graph measured against SPY, so the crosshair is the benchmark and every name sits in leading, weakening, lagging or improving. Macro scored off FRED real yields and breakevens. Commodities built around roll yield and ratios with five-year percentiles. Volatility where every gauge carries its one-year percentile, because VIX 18 is calm in 2022 and a warning in 2017. And Positioning, the weekly half: CFTC net positioning for asset managers, leveraged funds and dealers, each with three years of history and a percentile, plus the NAAIM survey of how much equity risk active managers actually carry.",
      "The Ticker page is where a trade gets checked before I take it. Full price history on TradingView's lightweight-charts, with revenue and net income overlaid on price, earnings and the last EPS surprise, analyst consensus and targets, short interest, headlines, and the option surface: IV rank, put/call, skew and an approximate gamma exposure.",
      "It runs entirely on yfinance, so there is no paid feed and no order flow. Every panel says how fresh its data is, pressure is estimated with proxies like TRIN and up/down volume rather than faked from tape that doesn't exist, and anything the feed won't serve is shown as unavailable instead of invented.",
    ],
    exhibits: [
      { img: 'cross-asset-rrg.png', caption: 'FIG. 01. Cross-Asset: the Relative Rotation Graph against SPY, with the rolling correlation matrix beside it.' },
      { img: 'ticker-research.png', caption: 'FIG. 02. Ticker: full price history, with analyst consensus, earnings, short interest and options signals on the rail.' },
      { img: 'commodities.png', caption: 'FIG. 03. Commodities: the board, roll yield as ETF over front contract, and gold against the 10-year real yield.' },
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
      "A global algorithmic trading competition run across timed rounds, mixing an algo trading challenge with separate manual reasoning puzzles each round. I competed solo, against roughly 18,800 teams and over 30,000 participants total, finishing 223rd overall, 7th in the Netherlands overall, and 1st in the Netherlands on the manual challenges (33rd globally).",
      "On the algorithmic side, work centered on pricing voucher options, estimating implied volatility and fitting it to a smile across strikes, then converting deviations from that smile into cross-sectional z-scores to flag mispriced vouchers. A market-making layer balanced quote competitiveness against inventory risk, with a regime-detection layer adjusting behavior as the simulated market's conditions shifted mid-round.",
      "Round 3 was humbling: an overfit algorithm looked incredible on the backtest and fell apart the moment live data arrived. From then on I optimized for strategies that were theoretically sound rather than ones that simply scored highest on a historical curve, which is what drove the results in rounds 4 and 5. For the manual rounds, the assumption was that most competitors would paste the problem into an LLM and run with the first answer, so instead of optimizing for the textbook-correct answer, I modeled what the crowd's likely solution would be and worked out where the real edge sat once everyone else had clustered around it. Against other humans, thinking about what they'll do beats pure optimization.",
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
    tags: ['Python', 'TensorFlow', 'Flask', 'SQLite', 'GCP'],
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

  /* ── 10. Clash Analyzer ──────────────────────────────────── */
  {
    id: 'clash',
    n: '10',
    year: '2026',
    cat: 'side',
    title: 'Clash Analyzer',
    em: 'battle analytics',
    role: 'Solo \u2219 Side',
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
      "A Clash Royale progress tracker, upgrade planner and battle-analytics dashboard, built on the official API. The API has no memory: the battlelog keeps only the last 30 or so games and a profile only shows its current state. So a background poller stores every battle and a profile snapshot in SQLite, and history builds up over time.",
      "From that history it computes what the game never shows you. Tilt: win rate after a win, after a loss, after two losses in a row. Session fatigue by game number, levels against skill, elixir leaked, nemesis and prey cards, and the best hour to play, all summed up as plain-English insights. The upgrade planner works out the gold and copies needed to take a deck to level 13\u201316, from a cost table kept by hand and checked against the published totals in tests.",
      "A daily crawl of the top 100 Path of Legends players gives card usage, win rates and top decks, and a vs Meta tab shows how each of your cards performs at the top. It gets the same statistical care as my quant work: every rate carries a 95% Wilson interval, and an insight only appears once the sample can support it. FastAPI and SQLite behind a strict TypeScript React 19 frontend, tested against recorded real API responses.",
    ],
    exhibits: [
      { img: 'overview.png', caption: 'FIG. 01. Player overview: profile, current deck, insights and ranked history.' },
      { img: 'battles.png', caption: 'FIG. 02. Battle analytics: tilt, fatigue, levels against skill, nemesis cards.' },
    ],
  },

  /* ── 11. OCR & LLM receipt extraction ─────────────────────── */
  {
    id: 'ocr-receipts',
    n: '11',
    year: '2025',
    cat: 'ml',
    title: 'Receipt extraction',
    em: 'OCR + LLM',
    role: 'Solo',
    type: 'Applied ML pipeline',
    tags: ['Python', 'Tesseract', 'Llama'],
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

  /* ── 12. AI Engineer Internship ───────────────────────────── */
  {
    id: 'internship',
    n: '12',
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
  'ocr-receipts':          'receipt-extraction',
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
  'prosperity', 'npec', 'waste-classifier', 'clash', 'ocr-receipts'];
PROJECTS.forEach(p => { if (HAS_COVER.includes(p.id)) p.cover = `/assets/images/${p.id}/cover.webp`; });

/* Convenience lookups used across pages */
const PROJECTS_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);
