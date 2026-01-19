const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const TASK_FILE = "./tasks.json";
const HISTORY_FILE = "./history.json";

// Create week key
const getWeekKey = () => {
    const d = new Date();
    const year = d.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const week = Math.ceil((((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
    return `${year}-W${week}`;
};

// GET tasks with rollover
app.get("/tasks", (req, res) => {
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

// POST tasks (update active week only)
app.post("/tasks", (req, res) => {
    const currentWeek = getWeekKey();
    const updated = {
        week: currentWeek,
        tasks: req.body
    };
    fs.writeFileSync(TASK_FILE, JSON.stringify(updated, null, 2));
    res.sendStatus(200);
});

app.listen(5000, () => console.log("Server running on port 5000"));
