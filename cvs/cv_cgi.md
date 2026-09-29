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
· Data & Cloud: Docker, Docker Compose, PostgreSQL, Microsoft Azure, Google Cloud (Cloud Run, Firebase), CI/CD (GitHub Actions, GHCR)
· ML / Data: PyTorch, Scikit-learn, pandas, NumPy, React, MLflow, Apache Airflow
· Tooling: Azure DevOps, FastAPI, Streamlit, MinIO, Portainer

EXPERIENCE

Part-time AI Engineer Intern                                                June 2025 – Present
· Designed and deployed a Retrieval-Augmented Generation (RAG) pipeline integrating a custom LLaMA model with external APIs, handling data retrieval logic, embedding storage, and query routing
· Built a full-stack application (FastAPI + JavaScript) deployed on Google Cloud Run and Firebase, making infrastructure decisions for scalability and security
· Integrated proxy systems in collaboration with senior engineers, identifying architectural constraints and implementing solutions
· Presented technical demos and documented system design decisions for stakeholder review

RELEVANT PROJECTS

Sentify: Emotion Classification Pipeline (Docker, FastAPI, Azure, PostgreSQL, MLflow)
· Built a full MLOps data pipeline as a university project: ingests YouTube videos, transcribes audio, translates to English, and classifies emotion per sentence into 7 classes using a fine-tuned BERT model (macro F1 improved from 0.41 to 0.84)
· Deployed the served application as a Docker Compose stack on Portainer: React/Vite frontend, FastAPI backend, Streamlit monitoring dashboard, PostgreSQL for predictions and user feedback, MinIO for artifact storage
· Implemented an automated retraining pipeline on Azure using Airflow: scheduled DAG pulls user feedback from PostgreSQL, fine-tunes the model, evaluates against the current champion, and promotes via MLflow model registry
· Set up CI/CD through GitHub Actions and GHCR for automated image builds and deployment

SwingLab & Money Dashboard: Personal Data Tools (Python, SQL, React)
· Built a backtesting platform and a real-time market monitoring dashboard to support personal trading decisions
· Money Dashboard ingests intraday market data (S&P 500, individual assets) via yfinance, stores it in a local data layer, and visualises volatility metrics to distinguish between market stress regimes and normal fluctuations
· Designed an SQL caching layer to optimise data retrieval and reduce pipeline runtime across the backtesting engine

NPEC: Netherlands Plant Eco-phenotyping Centre (Python, PyTorch)
· Built a U-Net segmentation model for root growth prediction and applied reinforcement learning (SAC/PPO) to optimise automated inoculation via an OT-2 robotic arm in simulation

Waste Classifier: Full-Stack Application (Flask, Django, GCP)
· Deployed an image classification app with MobileNet transfer learning (97.7% accuracy), REST API, user authentication, and containerised cloud deployment on Google Cloud Platform
