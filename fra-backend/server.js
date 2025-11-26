// ---------- IMPORTS ----------
const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");
const XLSX = require("xlsx"); // For Excel files

// ---------- APP SETUP ----------
const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));

// ---------- PATH ----------
const DATA_DIR = path.join(__dirname, "data");

// ---------- GENERIC LOADER ----------
function loadFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    try {
        if (ext === ".geojson" || ext === ".json") {
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        } else if (ext === ".csv") {
            return new Promise((resolve, reject) => {
                const results = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on("data", (row) => results.push(row))
                    .on("end", () => resolve(results))
                    .on("error", reject);
            });
        } else if (ext === ".xlsx" || ext === ".xls") {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
            return null; // unsupported
        }
    } catch (err) {
        console.error(`❌ Failed to load ${filePath}:`, err.message);
        return null;
    }
}

// ---------- ROUTES ----------

// List all available files
app.get("/data", (req, res) => {
    const files = fs.readdirSync(DATA_DIR).filter(f =>
        [".geojson", ".json", ".csv", ".xlsx", ".xls"].includes(path.extname(f).toLowerCase())
    );
    res.json({ available: files });
});

// Get specific file
app.get("/data/:filename", async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(DATA_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    const data = loadFile(filePath);

    if (data instanceof Promise) {
        try {
            const resolved = await data;
            res.json(resolved);
        } catch (err) {
            res.status(500).json({ error: "Failed to parse file" });
        }
    } else if (data) {
        res.json(data);
    } else {
        res.status(400).json({ error: "Unsupported file type" });
    }
});

// ---------- SERVER ----------
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving all files from /data`);
});
