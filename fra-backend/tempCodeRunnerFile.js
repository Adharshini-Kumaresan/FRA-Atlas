const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser"); // For census CSV parsing

const app = express();
const PORT = 5000;

// Utility: Load JSON/GeoJSON safely
const loadJSON = (filename) => {
    const filePath = path.join(__dirname, "data", filename);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

// ---------- DATA FILES ----------
const villages = loadJSON("villages_polygons_synthetic.geojson");
const villagesCentroids = loadJSON("villages_centroids_synthetic.geojson");
const claims = loadJSON("fra_claims.geojson");
const schemes = loadJSON("tribal_schemes_dss_with_benefits.json");

// ---------- HELPERS ----------
function filterClaims(query) {
    return claims.features.filter((c) => {
        const props = c.properties;

        if (query.status && props.status.toLowerCase() !== query.status.toLowerCase()) return false;
        if (query.type && props.type.toLowerCase() !== query.type.toLowerCase()) return false;
        if (query.village && props.village.toLowerCase() !== query.village.toLowerCase()) return false;
        if (query.applicant && !props.applicant.toLowerCase().includes(query.applicant.toLowerCase())) return false;
        return true;
    });
}

function filterSchemes(query) {
    return schemes.filter((s) => {
        if (query.category && s.category.toLowerCase() !== query.category.toLowerCase()) return false;
        if (query.village && s.village.toLowerCase() !== query.village.toLowerCase()) return false;
        if (query.priority && s.priority.toLowerCase() !== query.priority.toLowerCase()) return false;
        return true;
    });
}

// Load census CSV into memory (async)
function loadCensusData() {
    return new Promise((resolve, reject) => {
        const results = [];
        const filePath = path.join(__dirname, "data", "census_socioeconomic.csv");

        console.log("📂 Loading census file from:", filePath);

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("headers", (headers) => {
                console.log("📑 CSV Headers detected:", headers);
            })
            .on("data", (data) => results.push(data))
            .on("end", () => {
                console.log(`✅ Loaded ${results.length} census rows`);
                resolve(results);
            })
            .on("error", (err) => {
                console.error("❌ CSV parse error:", err.message);
                reject(err);
            });
    });
}

// ---------- ROUTES ----------

// ✅ Villages
app.get("/villages", (req, res) => {
    const { name } = req.query;
    let result = villages.features;
    if (name) {
        result = result.filter((v) =>
            v.properties.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    res.json(result);
});

app.get("/villages/centroids", (req, res) => {
    res.json(villagesCentroids);
});

// ✅ FRA Claims
app.get("/claims", (req, res) => {
    const filtered = filterClaims(req.query);
    res.json(filtered);
});

// Aggregation: claims by status
app.get("/claims/aggregate/status", (req, res) => {
    const filtered = filterClaims(req.query);
    const agg = {};
    filtered.forEach((c) => {
        const status = c.properties.status;
        agg[status] = (agg[status] || 0) + 1;
    });
    res.json(agg);
});

// Aggregation: claims by type
app.get("/claims/aggregate/type", (req, res) => {
    const filtered = filterClaims(req.query);
    const agg = {};
    filtered.forEach((c) => {
        const type = c.properties.type;
        agg[type] = (agg[type] || 0) + 1;
    });
    res.json(agg);
});

// ✅ Census Data (supports ?village= or ?name=, and ?nadu=)
app.get("/census", async (req, res) => {
    try {
        const { village, name, nadu } = req.query;
        const censusData = await loadCensusData();

        let filtered = censusData;

        const queryName = village || name;
        if (queryName) {
            filtered = filtered.filter((row) =>
                row.name && row.name.trim().toLowerCase().includes(queryName.trim().toLowerCase())
            );
        }

        if (nadu) {
            filtered = filtered.filter((row) =>
                row.nadu && row.nadu.trim().toLowerCase() === nadu.trim().toLowerCase()
            );
        }

        res.json(filtered);
    } catch (err) {
        console.error("Error loading census:", err);
        res.status(500).json({ error: "Failed to load census data" });
    }
});

// ✅ Census Aggregation
app.get("/census/aggregate", async (req, res) => {
    try {
        const { by = "nadu", village, name, nadu } = req.query;
        const censusData = await loadCensusData();

        let filtered = censusData;

        // Apply same filters as /census
        const queryName = village || name;
        if (queryName) {
            filtered = filtered.filter((row) =>
                row.name && row.name.trim().toLowerCase().includes(queryName.trim().toLowerCase())
            );
        }
        if (nadu) {
            filtered = filtered.filter((row) =>
                row.nadu && row.nadu.trim().toLowerCase() === nadu.trim().toLowerCase()
            );
        }

        // Group by field
        const groups = {};
        filtered.forEach((row) => {
            const key = (row[by] || "Unknown").trim();

            if (!groups[key]) {
                groups[key] = { count: 0 };
            }

            groups[key].count += 1;

            // Try aggregating numeric fields
            Object.keys(row).forEach((col) => {
                const value = parseFloat(row[col]);
                if (!isNaN(value)) {
                    if (!groups[key][col]) groups[key][col] = 0;
                    groups[key][col] += value;
                }
            });
        });

        // Compute averages
        const result = {};
        Object.entries(groups).forEach(([key, stats]) => {
            result[key] = { ...stats };
            Object.keys(stats).forEach((col) => {
                if (col !== "count" && typeof stats[col] === "number") {
                    result[key][`${col}_avg`] = stats[col] / stats.count;
                }
            });
        });

        res.json(result);
    } catch (err) {
        console.error("Error aggregating census:", err);
        res.status(500).json({ error: "Failed to aggregate census data" });
    }
});

// ✅ Schemes DSS
app.get("/schemes", (req, res) => {
    const filtered = filterSchemes(req.query);
    res.json(filtered);
});

// ✅ Analytics placeholder (AI / Satellite etc.)
app.get("/analytics", (req, res) => {
    const { category, village, year } = req.query;
    res.json({ message: "Analytics endpoint ready", category, village, year });
});

// ---------- SERVER ----------
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
