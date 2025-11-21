const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const db = require("./models/initDB");
const app = express();
const syncRouter = require("./routes/sync");
app.use("/sync", syncRouter);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const whatsappRouter = require("./routes/whatsapp");
app.use("/whatsapp", whatsappRouter);


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
