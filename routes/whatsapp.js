const express = require("express");
const router = express.Router();
const chrono = require("chrono-node");
const axios = require("axios");
const crypto = require("crypto");
const db = require("../models/initDB");

// ML service URL
const TRIAGE_API = "http://127.0.0.1:5001/triage"; // change to deployed URL later

// --- parse appointment time ---
function parseAppointmentTime(message) {
    const dt = chrono.parseDate(message);
    if (dt) return dt.getTime();
    const fallback = new Date();
    fallback.setHours(fallback.getHours() + 1);
    return fallback.getTime();
}

router.post("/", async (req, res) => {
    const msg = (req.body.Body || "").trim();
    const from = req.body.From;

    console.log("\n--- Incoming WhatsApp Message ---");
    console.log({ from, msg });

    // 1) BOOKING LOGIC
    if (msg.toLowerCase().startsWith("book")) {
        const dateMs = parseAppointmentTime(msg);
        const displayDate = new Date(dateMs).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });

        const id = crypto.randomUUID();
        const now = Date.now();

        db.run(
            `INSERT INTO appointments 
       (id, patient_id, doctor_id, date, status, triage_severity, symptoms, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, from, null, dateMs, "pending", 1, null, now, now]
        );

        return res.send(`
      <Response>
        <Message>
Your appointment request has been recorded for:
${displayDate}

A doctor will confirm it shortly.
        </Message>
      </Response>
    `);
    }

    // 2) SYMPTOM → TRIAGE LOGIC
    try {
        const mlResponse = await axios.post(TRIAGE_API, {
            symptoms: msg,
        });

        const triage = mlResponse.data;

        const { severity, category, summary, recommendation } = triage;

        // Store triage result into DB
        const id = crypto.randomUUID();
        const now = Date.now();

        db.run(
            `INSERT INTO appointments 
       (id, patient_id, doctor_id, date, status, triage_severity, symptoms, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                from,
                null,
                now,
                "triage_pending",
                severity,
                msg,
                now,
                now,
            ]
        );

        return res.send(`
      <Response>
        <Message>
*Triage Assessment Complete*

Summary: ${summary}
Severity Level: ${severity}
Category: ${category}

Recommendation:
${recommendation}

This is an automated assessment, not a medical diagnosis.
        </Message>
      </Response>
    `);
    } catch (err) {
        console.error("Triage API error:", err.toString());
        return res.send(`
      <Response>
        <Message>
Sorry, I couldn't analyze your symptoms due to a server issue.
Please try again shortly.
        </Message>
      </Response>
    `);
    }
});

module.exports = router;
