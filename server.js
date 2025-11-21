const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Test route
app.get("/", (req, res) => {
    res.send("Backend running successfully!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
