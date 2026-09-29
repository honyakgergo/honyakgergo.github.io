Gergő Honyák
honyakgergo7@gmail.com | linkedin | github

EDUCATION
Breda University of Applied Sciences                                        Second Year Student
Bachelor of Applied Data Science and AI                                     GPA 4.0

Eindhoven University of Technology (TU/e)                                   Starting Sep 2026
Pre-Master in Data Science. Seeking graduation internship from Jan 2027

Spoken Languages: English C1, German B2, Dutch (learning), Hungarian (native)

TECHNICAL SKILLS
· Programming: Python, JavaScript, SQL
· Quantitative Methods: Statistical inference, hypothesis testing, time-series modeling, cross-sectional factor modeling, walk-forward validation, Monte Carlo simulation, Fama-French regression
· ML / Data: PyTorch, Scikit-learn, XGBoost, pandas, NumPy, FastAPI, React, Streamlit
· Tooling: Microsoft Excel, Docker, Google Cloud Platform, MLflow, Airflow

EXPERIENCE

Part-time AI Engineer Intern                                                June 2025 – Present
· Designed and deployed a Retrieval-Augmented Generation (RAG) pipeline integrating a custom LLaMA model with external APIs, handling data retrieval and query routing
· Built a full-stack application (FastAPI + JavaScript) deployed on Google Cloud Run and Firebase
· Collaborated with senior engineers on system integration, presented technical demos and documented design decisions for stakeholder review

RELEVANT PROJECTS

GNN-Based Cross-Sectional Return Prediction (Python, PyTorch)
· Built a graph neural network to predict forward returns on a 100-stock universe, testing whether learned cross-sectional relationships add predictive value over a trend-following baseline
· Validated over 83 quarters of walk-forward testing: Information Coefficient = 0.051 (p = 0.007), confirming statistically significant out-of-sample predictive power
· Confirmed alpha is not explained by standard risk factors via Fama-French 5 + Momentum regression (t-stat = 3.77, p = 0.0002)
· Annualised return 27.3%, max drawdown reduced by 24% relative to baseline (−27.6% vs −36.4%)

SwingLab: Quantitative Risk & Strategy Platform (Python, SQL, React)
· Built a research platform for developing and stress-testing quantitative strategies with integrated risk analytics across a multi-asset universe
· Implemented a 7-signal macro risk indicator combining volatility (VIX), yield curve slope, credit spreads (HYG), treasury flows (TLT), and currency strength to detect regime shifts and adjust risk exposure
· Validated strategy robustness via Monte Carlo simulation and transaction cost modeling
· Designed an SQL caching layer to optimise data retrieval and reduce pipeline runtime

Money Dashboard: Volatility & Risk Monitoring Tool (Python)
· Built a real-time dashboard ingesting intraday market data (S&P 500, individual assets) via yfinance with automatic refresh on new data
· Visualises multiple volatility measures to distinguish between elevated-risk regimes and normal market fluctuations, supporting data-driven risk decisions

Data Drift Monitoring Dashboard (Python, XGBoost, Streamlit)
· Trained an XGBoost fraud classifier (AUC-ROC 0.96) and built a Streamlit dashboard to monitor model degradation across 5 simulated drift scenarios
· Applied KS tests and Population Stability Index (PSI) to detect distributional shifts, traced performance collapse back to specific feature drift, and demonstrated that PSI and KS are complementary (PSI missed concept drift that KS flagged)
· Defined automated alert thresholds and a retraining strategy based on drift severity
