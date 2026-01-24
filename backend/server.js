require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const supabase = require("./supabase");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   AUTH MIDDLEWARE
   ========================= */
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing auth header" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* =========================
   LOGIN (PUBLIC)
   ========================= */
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  if (password !== process.env.APP_PASS) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ user: "owner" }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token });
});

/* =========================
   WEEK HELPER
   ========================= */
const getWeekKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const week = Math.ceil(
    (((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7
  );
  return `${year}-W${week}`;
};

/* =========================
   GET TASKS (CURRENT WEEK)
   ========================= */
app.get("/tasks", auth, async (req, res) => {
  const currentWeek = getWeekKey();

  // 1. Get latest tasks (any week)
  const { data: existing, error } = await supabase
    .from("tasks")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // No tasks ever
  if (!existing || existing.length === 0) {
    return res.json([]);
  }

  const storedWeek = existing[0].week;

  // 2. Week changed → archive old week
  if (storedWeek !== currentWeek) {

    // Fetch all tasks of previous week
    const prevTasks = existing.filter(t => t.week === storedWeek);

    // Apply accountability rule
    const finalized = prevTasks.map(t => ({
      id: t.id,
      task: t.name,
      days: t.days.map(d => (d === "empty" ? "miss" : d))
    }));

    // Save to history
    await supabase.from("history").insert({
      week: storedWeek,
      tasks: finalized
    });

    // Delete old week tasks
    await supabase.from("tasks").delete().eq("week", storedWeek);

    // Reset for new week
    const reset = prevTasks.map(t => ({
      id: t.id,
      name: t.name,
      days: Array(7).fill("empty"),
      week: currentWeek
    }));

    await supabase.from("tasks").insert(reset);

    return res.json(
      reset.map(t => ({
        id: t.id,
        task: t.name,
        days: t.days
      }))
    );
  }

  // 3. Same week → return current tasks
  const currentTasks = existing.filter(t => t.week === currentWeek);

  res.json(
    currentTasks.map(t => ({
      id: t.id,
      task: t.name,
      days: t.days
    }))
  );
});


/* =========================
   SAVE TASKS (CURRENT WEEK)
   ========================= */
app.post("/tasks", auth, async (req, res) => {
  const week = getWeekKey();
  const tasks = req.body;

  // Clear current week
  await supabase.from("tasks").delete().eq("week", week);

  // Insert updated tasks
  const payload = tasks.map(t => ({
    id: t.id,
    name: t.task,
    days: t.days,
    week
  }));

  const { error } = await supabase.from("tasks").insert(payload);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.sendStatus(200);
});

/* =========================
   GET HISTORY
   ========================= */
app.get("/history", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(
    data.map(h => ({
      week: h.week,
      tasks: h.tasks
    }))
  );
});

/* =========================
   START SERVER
   ========================= */
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
