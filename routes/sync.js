const express = require("express");
const router = express.Router();
const db = require("../models/initDB");

// Helper: run SQL async
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// ---------------------- GET /sync -----------------------------

router.get("/", async (req, res) => {
    const lastPulled = parseInt(req.query.last_pulled_at || 0);

    try {
        const tables = [
            "users",
            "appointments",
            "prescriptions",
            "hospitals",
        ];

        const changes = {};

        for (const table of tables) {
            const created = await runQuery(
                `SELECT * FROM ${table} WHERE created_at > ?`,
                [lastPulled]
            );

            const updated = await runQuery(
                `SELECT * FROM ${table} WHERE updated_at > ? AND created_at <= ?`,
                [lastPulled, lastPulled]
            );

            // NOTE: WatermelonDB expects deleted IDs, but we skip delete for hackathon
            const deleted = [];

            changes[table] = { created, updated, deleted };
        }

        res.json({
            changes,
            timestamp: Date.now()
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ---------------------- POST /sync -----------------------------

router.post("/", async (req, res) => {
    const { changes } = req.body;
    const tables = Object.keys(changes);

    try {
        const timestamp = Date.now();

        for (const table of tables) {
            const { created, updated } = changes[table];

            // ---- INSERT NEW ROWS ----
            for (const row of created) {
                const cols = Object.keys(row).join(",");
                const placeholders = Object.keys(row).map(() => "?").join(",");
                const values = Object.values(row);

                db.run(
                    `INSERT OR IGNORE INTO ${table} (${cols}) VALUES (${placeholders})`,
                    values
                );
            }

            // ---- UPDATE EXISTING ROWS (Last Write Wins) ----
            for (const row of updated) {
                const id = row.id;
                delete row.id;

                const setClause = Object.keys(row)
                    .map((col) => `${col} = ?`)
                    .join(",");

                const values = [...Object.values(row), id];

                db.run(
                    `UPDATE ${table} SET ${setClause}, updated_at = ? WHERE id = ?`,
                    [...Object.values(row), timestamp, id]
                );
            }

            // (Optional): Handle deletes if needed
        }

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
