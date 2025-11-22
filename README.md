E-Bharath — Gateway to the Digital Era of a Healthy India

E-Bharath is an offline-first rural healthcare platform built to function even when internet connectivity is unreliable or completely unavailable.
Doctors access the system through a React Native mobile app, while patients interact through WhatsApp—no separate app needed.

This project was engineered under a 10-hour rapid-development protocol, using a resilient architecture that prioritizes offline reliability, data privacy, and accessibility.

🚨 Why This Project?

Rural India faces major healthcare challenges:

Internet connectivity is intermittent across 69% of rural regions.

Patients often struggle with digital literacy.

Cloud-first apps fail when networks drop.

Medical triage tools are rarely available offline.

E-Bharath solves this through:

Offline-first mobile app for doctors (local database is the source of truth)

WhatsApp-based patient interface (zero learning curve)

On-device or local AI triage

Secure prescription workflow

Emergency resource mapping

🏛️ System Architecture
1. Offline-First Doctor App (React Native + WatermelonDB)

Local SQLite storage via JSI

Lazy loading ensures instant app launch

Works fully in flight mode

Auto-sync when online using a custom sync engine

Encrypted data storage

Ideal for rural clinics & mobile health vans

2. WhatsApp Patient Interface (Twilio API)

Patients can:

Book appointments

Report symptoms

Chat with the AI triage bot

Receive prescriptions as structured messages/PDF

Get follow-up reminders

Requires no app installation — uses WhatsApp only.

3. Hybrid Backend
Node.js Server

Authentication (JWT)

Sync endpoints for mobile app

WhatsApp webhook processing

Secure prescriptions

Patient history consolidation

Python ML Microservice

Symptom parsing

Severity classification

Emergency flagging

Synthetic data generation

Built on Flask + LLM-based triage logic.

4. Local AI Triage Bot

Runs offline using cached data

Never diagnoses diseases

Provides condition info

Asks clarifying questions

Flags red-flag symptoms

Privacy-first — no sensitive data leaves device

🧠 Triage Intelligence Flow

Input: Patient sends “I have fever and headache”.

Local Evaluation: Query local dataset + govt health resources.

Clarification: “How many days? Do you have chills?”

Severity Check: Flags emergencies.

Advice:

Home-care instructions for mild cases

Recommend doctor visit for urgent cases

🗺️ Emergency Resource Tracker

Built for real-time disaster or emergency scenarios:

Nearest hospital locations

Bed capacity (green/red markers)

Oxygen availability

FHIR-compatible resource data model

Works offline with periodic sync

🧩 Tech Stack
🌐 Frontend (Doctor App)

React Native

WatermelonDB (offline-first database)

React Navigation

React Native Maps

TypeScript

🔧 Backend

Node.js + Express

SQLite / MongoDB

Twilio WhatsApp API

JWT Authentication

🤖 AI / ML

Python + Flask

LLMs for symptom triage

Pandas, NLTK

Synthetic data generation

☁️ Deployment

Render / Heroku

ngrok for webhook tunneling

Twilio Sandbox for WhatsApp

⚡ 10-Hour Execution Protocol

A strict rapid-development roadmap ensured successful completion under hackathon constraints:

Hours 0–2: Foundation

Repo setup

Backend and ML scaffolding

WatermelonDB installation

Data schema definition

Hours 3–6: Core Build

Sync engine (GET/POST /sync)

Appointment and patient models

WhatsApp webhook integration

AI triage service

Hours 7–9: Polish

Network-awareness UI

Security (input sanitization, Twilio signature validation)

Synthetic data for demo

Map UI for hospitals

Hour 10: Deployment

Backend deployed

ML service stabilized

Final APK build & demo recording

🔐 Security & Compliance

End-to-end data encryption

Offline data stored in encrypted SQLite

No diagnosis — only severity suggestion (reduces liability)

Aligned with ABDM compliance principles

No cloud dependency for critical features

🚀 Features

Offline patient history

Appointment booking

WhatsApp chat-based patient interface

Local AI symptom triage

Emergency resource map

Digital prescriptions via WhatsApp

Multi-device sync

Fast, resilient, and secure design

🛣️ Future Roadmap
📌 Short-Term

Expand medical dataset

Multi-language support (Kannada, Hindi, Telugu, Tamil)

CBT mental-health module

Better resource dashboards

📌 Long-Term

ABDM national integration

Cloud-AI fallback

On-premise LLM for hospitals

Region-wise outbreak prediction

🛠️ Developer Setup
📱 Mobile App
cd mobile
npm install
npx pod-install
npm run android   # or npm run ios

🖥️ Node.js Backend
cd server
npm install
npm start

🤖 ML Service
cd ml
pip install -r requirements.txt
python app.py

📂 Project Structure
E-Bharath/
│
├── mobile/            # React Native app (WatermelonDB)
├── server/            # Node.js backend
├── ml/                # Python triage service
├── docs/              # PPT, PDF, architecture docs
└── README.md
