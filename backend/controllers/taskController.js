import Task from "../models/Task.js";
import { getWeekKey } from "../utils/weekHelper.js";

// CREATE
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      weekKey: getWeekKey()
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
};

// UPDATE
export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
};

// DELETE
export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};

// ✅ CURRENT WEEK
export const getCurrentWeekTasks = async (req, res) => {
  const currentWeek = getWeekKey();

  const tasks = await Task.find({ weekKey: currentWeek })
    .sort({ createdAt: -1 });

  res.json(tasks);
};

// ✅ HISTORY
export const getHistoryTasks = async (req, res) => {
  const currentWeek = getWeekKey();

  const tasks = await Task.find({
    weekKey: { $ne: currentWeek }
  }).sort({ weekKey: -1 });

  res.json(tasks);
};

// ✅ STATS
export const getStats = async (req, res) => {
  const tasks = await Task.find();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = total - completed;

  const completionRate = total === 0
    ? 0
    : ((completed / total) * 100).toFixed(2);

  res.json({
    total,
    completed,
    pending,
    completionRate
  });
};

// ✅ CARRY FORWARD
export const carryForwardTasks = async (req, res) => {
  const currentWeek = getWeekKey();

  const oldTasks = await Task.find({
    status: "pending",
    weekKey: { $ne: currentWeek }
  });

  const updatedTasks = await Promise.all(
    oldTasks.map(task =>
      Task.findByIdAndUpdate(
        task._id,
        { weekKey: currentWeek },
        { new: true }
      )
    )
  );

  res.json(updatedTasks);
};