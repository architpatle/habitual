const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "./tasks.json";

// Load tasks
app.get("/tasks", (req, res) => {
  fs.readFile(FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading tasks file");
    res.json(JSON.parse(data || "[]"));
  });
});

// Save tasks
app.post("/tasks", (req, res) => {
  const tasks = req.body;
  fs.writeFile(FILE, JSON.stringify(tasks, null, 2), (err) => {
    if (err) return res.status(500).send("Error writing tasks file");
    res.sendStatus(200);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
