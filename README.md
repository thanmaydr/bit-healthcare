This branch contains all backend development handled by Dev A, including the Node.js server, database schema, sync engine, security layer, and WhatsApp webhook integration.

Dev A owns the core backend infrastructure that powers data flow between the doctor’s offline-first app, the ML service, and the WhatsApp patient interface.

📌 Responsibilities in This Branch

Dev A’s work includes:

Backend project setup (Node.js + Express)

Authentication (JWT-based)

Local database (SQLite/Mongo) and schema creation

WatermelonDB sync protocol implementation

Twilio WhatsApp webhook (+ message parsing + outgoing replies)

Prescription sending flow

Security (Helmet, input validation, Twilio signature check)

Deployment of backend (Render/Heroku)

🛠️ Tech Stack

Node.js + Express

SQLite (for hackathon) / MongoDB (optional)

JWT Authentication

Twilio WhatsApp API

ngrok (local WhatsApp testing)

Helmet / CORS / dotenv

📁 Folder Structure (dev-A)
dev-A/
│
├── controllers/
│   ├── authController.js
│   ├── syncController.js
│   ├── whatsappController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── syncRoutes.js
│   ├── whatsappRoutes.js
│
├── models/
│   ├── User.js
│   ├── Appointment.js
│   ├── Prescription.js
│   ├── Hospital.js
│
├── db/
│   ├── sqlite.db
│   ├── migrations/
│
├── utils/
│   ├── jwt.js
│   ├── validateTwilio.js
│   ├── wrap.js
│
├── app.js
├── server.js
├── .env.example
└── package.json

🚀 Setup Instructions
1. Install Dependencies
npm install

2. Set Up Environment Variables

Copy .env.example → .env and fill:

PORT=4000
JWT_SECRET=your_secret_key

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_NUMBER=

ML_SERVICE_URL=http://localhost:5000/triage

3. Start Backend
npm start

4. For Local WhatsApp Testing

Expose webhook:

ngrok http 4000


Set Twilio Sandbox webhook URL to:

https://<ngrok-url>/whatsapp/webhook

📌 WatermelonDB Sync API (Critical for Dev C)
GET /sync

Return all changes since last sync:

{
  "changes": {
    "users": [],
    "appointments": [],
    "prescriptions": []
  },
  "timestamp": 1732290012
}

POST /sync

Accepts:

created

updated

deleted

Applies them to the backend DB.

Conflict Rule: Last Write Wins.

📞 WhatsApp Webhook

POST /whatsapp/webhook

Handles:

Booking messages ("Book 22 Nov 5pm")

Symptom messages → forwarded to ML service

Replies back using Twilio API

This is the entry point for all patient messages.

🔐 Security Checklist

Dev A must ensure:

✔ Helmet enabled

✔ Input validation

✔ Twilio X-Twilio-Signature verification

✔ JWT protection around private routes

✔ No plaintext medical data in logs

✔ Sanitized JSON parsing

✔ Disable detailed error traces in production

🌐 Deployment

Backend deployment (Render/Heroku):

git push origin dev-A


After deployment, update the Twilio webhook URL in Sandbox settings.
