const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5001;
const SOS_FILE = "sos_data.json";

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Load existing SOS data
function loadSOSData() {
    try {
        const data = fs.readFileSync(SOS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return []; // Return empty array if file doesn't exist
    }
}

// Save new SOS data
function saveSOSData(data) {
    fs.writeFileSync(SOS_FILE, JSON.stringify(data, null, 4));
}

// Handle SOS requests
app.post("/sos", (req, res) => {
    const newSOS = req.body;
    let sosList = loadSOSData();

    // Check if user already sent an SOS (update instead of duplicate)
    const existingIndex = sosList.findIndex(entry => entry.user_id === newSOS.user_id);
    if (existingIndex !== -1) {
        sosList[existingIndex].lat = newSOS.lat;
        sosList[existingIndex].lon = newSOS.lon;
    } else {
        sosList.push(newSOS); // Add new SOS
    }

    saveSOSData(sosList);
    res.json({ message: "SOS received" });
});

// Send stored SOS data
app.get("/get_sos", (req, res) => {
    res.json(loadSOSData());
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});