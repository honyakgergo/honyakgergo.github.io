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
· Statistics & Forecasting: Time-series modeling, cross-sectional prediction, walk-forward validation, hypothesis testing, statistical inference, Monte Carlo simulation
· ML / Data: PyTorch, Scikit-learn, pandas, NumPy, FastAPI, React, MLflow
· Tooling: Docker, Google Cloud Platform, Streamlit, Azure DevOps

EXPERIENCE

Part-time AI Engineer Intern                                                June 2025 – Present
· Designed and deployed a Retrieval-Augmented Generation (RAG) pipeline integrating a custom LLaMA model with external APIs, handling data retrieval logic and query routing
· Built a full-stack application (FastAPI + JavaScript) deployed on Google Cloud Run and Firebase
· Collaborated with senior engineers on system integration, presented technical demos and documented design decisions for stakeholder review

RELEVANT PROJECTS

GNN-Based Cross-Sectional Forecasting Model (Python, PyTorch)
· Built a graph neural network to forecast asset returns on a 100-stock universe, testing whether GNN-based prediction outperforms a trend-following baseline over a 20-year period
· Validated forecast accuracy through 83-quarter walk-forward evaluation: Information Coefficient = 0.051 (p = 0.007), confirming statistically significant out-of-sample predictive power
· Constructed correlation-based input graphs to capture cross-sectional relationships, allowing the model to learn which co-movement patterns are predictive of forward returns
· Confirmed that forecast alpha is not explained by known risk factors via a 6-factor regression (t-stat = 3.77, p = 0.0002)

SwingLab: Statistical Forecasting & Backtesting Platform (Python, SQL, React)
· Built a research platform for developing, testing, and validating statistical forecasting strategies across a multi-asset universe
· Implemented cross-sectional momentum forecasting with 9-month formation windows and monthly rebalancing, achieving 70.5% directional accuracy out-of-sample
· Developed a 7-signal macro composite indicator (volatility, yield curve, credit spreads, treasury flows, currency strength) to forecast regime shifts and conditionally adjust strategy behaviour
· Validated robustness via Monte Carlo simulation and transaction cost modeling to ensure forecasts hold under realistic conditions
· Designed an SQL caching layer to optimise data retrieval and reduce pipeline runtime

Money Dashboard: Real-Time Market Analytics Tool (Python)
· Built a personal analytics dashboard that ingests intraday market data, stores it locally, and visualises volatility metrics to distinguish between stress regimes and normal market fluctuations
· Designed to surface actionable signals from noisy data, refreshing automatically as new data becomes available

Sentify: Emotion Classification Pipeline (Docker, FastAPI, Azure, PostgreSQL, MLflow)
· Built a full MLOps pipeline as a university project: ingests video, transcribes, translates, and classifies emotion per sentence using a fine-tuned BERT model (F1 improved from 0.41 to 0.84), with automated retraining on Azure via Airflow and model versioning through MLflow
