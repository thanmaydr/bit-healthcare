const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("hack.db");

db.serialize(() => {

    // USERS
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      whatsapp_id TEXT UNIQUE,
      password_hash TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

    // APPOINTMENTS
    db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      doctor_id TEXT,
      date INTEGER,
      status TEXT DEFAULT 'pending',
      triage_severity INTEGER DEFAULT 0,
      symptoms TEXT,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY(patient_id) REFERENCES users(id),
      FOREIGN KEY(doctor_id) REFERENCES users(id)
    )
  `);

    // PRESCRIPTIONS
    db.run(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      appointment_id TEXT,
      medications TEXT NOT NULL,
      instructions TEXT,
      is_encrypted INTEGER DEFAULT 1,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY(appointment_id) REFERENCES appointments(id)
    )
  `);

    // HOSPITALS
    db.run(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      bed_count INTEGER NOT NULL,
      resources TEXT NOT NULL,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

});

module.exports = db;
