import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getCurrentWeekTasks,
  getHistoryTasks,
  carryForwardTasks,
  getStats
} from "../controllers/taskController.js";

const router = express.Router();

router.route("/")
  .post(createTask)
  .get(getTasks);

router.route("/:id")
  .put(updateTask)
  .delete(deleteTask);

router.get("/current", getCurrentWeekTasks);

export default router;