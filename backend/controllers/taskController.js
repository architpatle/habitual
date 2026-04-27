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

    // Get current week tasks
    let tasks = await Task.find({
      user: req.user._id,
      weekKey
    }).sort({ order: 1 });

    // If current week exists
    if (tasks.length > 0) {
      return res.status(200).json(tasks);
    }

    // Get latest previous tasks
    const previousTasks = await Task.find({
      user: req.user._id
    }).sort({
      weekKey: -1,
      order: 1
    });

    // If no previous tasks
    if (previousTasks.length === 0) {
      return res.status(200).json([]);
    }

    // Get unique tasks while preserving order
    const uniqueTasks = [];
    const seen = new Set();

    previousTasks.forEach((task) => {
      if (!seen.has(task.title)) {
        seen.add(task.title);

        uniqueTasks.push({
          title: task.title,
          order: task.order
        });
      }
    });

    // Clone into new week
    const newWeekTasks = await Task.insertMany(
      uniqueTasks.map((task) => ({
        user: req.user._id,
        title: task.title,
        weekKey,
        days: Array(7).fill("empty"),
        order: task.order
      }))
    );

    res.status(200).json(newWeekTasks);

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

    // Get current task count for ordering
    const taskCount = await Task.countDocuments({
      user: req.user._id,
      weekKey
    });

    const task = new Task({
      user: req.user._id,
      title: title.trim(),
      weekKey,
      days: Array(7).fill("empty"),
      order: taskCount + 1
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

    const allowedValues = [
      "empty",
      "done",
      "miss"
    ];

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
    }).sort({
      weekKey: -1,
      order: 1
    });

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

// 🔀 REORDER TASKS
export const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    for (const item of tasks) {
      await Task.findOneAndUpdate(
        {
          _id: item.id,
          user: req.user._id
        },
        {
          order: item.order
        }
      );
    }

    res.status(200).json({
      message: "Tasks reordered successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};