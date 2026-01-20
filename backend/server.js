require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const app = express();
app.use(cors());
app.use(express.json());

const TASK_FILE = "./tasks.json";
const HISTORY_FILE = "./history.json";


app.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  if (password !== process.env.APP_PASS) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Issue token (valid 7 days)
  const token = jwt.sign({ user: "owner" }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token });
});

// Create week key
const getWeekKey = () => {
    const d = new Date();
    const year = d.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const week = Math.ceil((((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
    return `${year}-W${week}`;
};

// GET tasks with rollover
app.get("/tasks",auth, (req, res) => {
    let stored = {
        week: null,
        tasks: []
    };

    if (fs.existsSync(TASK_FILE)) {
        stored = JSON.parse(fs.readFileSync(TASK_FILE, "utf8") || "{}");
    }

    const currentWeek = getWeekKey();

    // First time or week changed?
    if (!stored.week || stored.week !== currentWeek) {
        // Archive old week to history (if exists)
        if (stored.week && stored.tasks.length > 0) {
            let history = [];
            if (fs.existsSync(HISTORY_FILE)) {
                history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8") || "[]");
            }

            // Convert empty -> miss (Accountability Rule)
            const finalizedTasks = stored
                .tasks
                .map(t => ({
                    ...t,
                    days: t
                        .days
                        .map(d => d === "empty"
                            ? "miss"
                            : d)
                }));

            history.push({
                week: stored.week,
                generatedAt: new Date().toISOString(),
                tasks: finalizedTasks
            });

            fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        }

        // Reset new week
        const resetTasks = stored
            .tasks
            .map(t => ({
                ...t,
                days: Array(7).fill("empty")
            }));

        stored = {
            week: currentWeek,
            tasks: resetTasks
        };

        // Save reset week
        fs.writeFileSync(TASK_FILE, JSON.stringify(stored, null, 2));
    }

    res.json(stored.tasks);
});

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Missing auth header" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next(); // allow request to continue
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// get history
app.get("/history",auth, (req,res) => {
  if (!fs.existsSync(HISTORY_FILE)) {
    return res.json([]);
  }
  const history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8") || "[]");
  res.json(history);
});



// POST tasks (update active week only)
app.post("/tasks",auth, (req, res) => {
    const currentWeek = getWeekKey();
    const updated = {
        week: currentWeek,
        tasks: req.body
    };
    fs.writeFileSync(TASK_FILE, JSON.stringify(updated, null, 2));
    res.sendStatus(200);
});

app.listen(5000, () => console.log("Server running on port 5000"));
