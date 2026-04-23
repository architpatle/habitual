import Task from "../models/Task.js";

// 🧠 GET CURRENT WEEK
export const getCurrentWeekTasks = async (req, res) => {
  try {
    const { weekKey } = req.query;

    const tasks = await Task.find({ weekKey });
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, weekKey } = req.body;

    const task = new Task({
      title,
      weekKey,
      days: Array(7).fill("empty")
    });

    const saved = await task.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔁 UPDATE DAY STATUS
export const updateTaskDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayIndex, value } = req.body;

    const task = await Task.findById(id);

    task.days[dayIndex] = value;
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📚 HISTORY
export const getHistoryTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task Title
export const updateTaskTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};