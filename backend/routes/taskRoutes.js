import express from "express";
import {
  getCurrentWeekTasks,
  createTask,
  updateTaskDay,
  deleteTask,
  getHistoryTasks,
  updateTaskTitle
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/current", getCurrentWeekTasks);
router.get("/history", getHistoryTasks);

router.post("/", createTask);
router.patch("/:id/day", updateTaskDay);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTaskTitle);

export default router;