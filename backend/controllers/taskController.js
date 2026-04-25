import Task from "../models/Task.js";

// 🧠 GET CURRENT WEEK TASKS
export const getCurrentWeekTasks = async (req, res) => {
  try {
    const { weekKey } = req.query;

    if (!weekKey) {
      return res.status(400).json({
        message: "weekKey is required"
      });
    }

    const tasks = await Task.find({
      user: req.user._id,
      weekKey
    }).sort({ createdAt: 1 });

    res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ➕ CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, weekKey } = req.body;

    if (!title || !weekKey) {
      return res.status(400).json({
        message: "Title and weekKey are required"
      });
    }

    const task = new Task({
      user: req.user._id,
      title: title.trim(),
      weekKey,
      days: Array(7).fill("empty")
    });

    const savedTask = await task.save();

    res.status(201).json(savedTask);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// 🔁 UPDATE DAY STATUS
export const updateTaskDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayIndex, value } = req.body;

    const allowedValues = ["empty", "done", "miss"];

    if (
      dayIndex < 0 ||
      dayIndex > 6 ||
      !allowedValues.includes(value)
    ) {
      return res.status(400).json({
        message: "Invalid day update"
      });
    }

    const task = await Task.findOne({
      _id: id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    task.days[dayIndex] = value;

    await task.save();

    res.status(200).json(task);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ❌ DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// 📚 GET HISTORY TASKS
export const getHistoryTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id
    }).sort({ weekKey: -1 });

    res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ✏️ UPDATE TASK TITLE
export const updateTaskTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id
      },
      {
        title: title.trim()
      },
      {
        new: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};