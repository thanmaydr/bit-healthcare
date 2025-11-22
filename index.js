import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve UI from /public folder
app.use(express.static(path.join(__dirname, "public")));

// Explicit homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Load dataset
const datasetPath = path.join(__dirname, "data", "dataset.json");
let dataset = [];

try {
  const rawData = fs.readFileSync(datasetPath, "utf8");
  dataset = JSON.parse(rawData);
  console.log("Dataset loaded successfully:", dataset.length, "items");
} catch (err) {
  console.error("Error loading dataset:", err);
}

// ----------- SEARCH LOGIC - SMART MATCHING --------------
function searchDataset(query) {
  query = query.toLowerCase();

  for (const item of dataset) {
    const symptom = item.symptom.toLowerCase().replace(/_/g, " ");

    // Match symptom name
    if (query.includes(symptom)) return item.response;

    // Match examples
    for (const ex of item.examples) {
      if (query.includes(ex.toLowerCase())) return item.response;
    }

    // Match keywords from symptom
    const keywords = item.symptom.toLowerCase().split("_");
    for (const word of keywords) {
      if (query.includes(word)) return item.response;
    }

    // Match common short words: "fever", "cold", "pain", "cough"
    if (
      query.includes("fever") && item.symptom.includes("fever") ||
      query.includes("cough") && item.symptom.includes("cough") ||
      query.includes("cold") && item.symptom.includes("cold") ||
      query.includes("headache") && item.symptom.includes("headache")
    ) {
      return item.response;
    }
  }

  return "Please provide more details… I could not find an answer.";
}
// --------------------------------------------------------

// POST API for chatbot
app.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const answer = searchDataset(question);
  res.json({ answer });
});

// Start server
app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
