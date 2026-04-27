import express from "express";

import {
  getCurrentWeekTasks,
  createTask,
  updateTaskDay,
  deleteTask,
  getHistoryTasks,
  updateTaskTitle,
  reorderTasks
} from "../controllers/taskController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Current Week Tasks
router.get(
  "/current",
  protect,
  getCurrentWeekTasks
);

// History Tasks
router.get(
  "/history",
  protect,
  getHistoryTasks
);

// Create Task
router.post(
  "/",
  protect,
  createTask
);

// 🔀 Reorder Tasks
router.patch(
  "/reorder",
  protect,
  reorderTasks
);

// Update Task Day Status
router.patch(
  "/:id/day",
  protect,
  updateTaskDay
);

// Update Task Title
router.patch(
  "/:id",
  protect,
  updateTaskTitle
);

// Delete Task
router.delete(
  "/:id",
  protect,
  deleteTask
);

export default router;