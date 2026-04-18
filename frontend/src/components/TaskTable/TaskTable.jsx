import React from "react";
import styles from "./TaskTable.module.css";
import { FiCheck, FiTrash2, FiPlus } from "react-icons/fi";
import API from "../../utils/api";

const TaskTable = ({ tasks, refreshTasks, editable = true }) => {

  // ✅ CREATE TASK
  const addTask = async () => {
    if (!editable) return;

    const title = prompt("Enter task name:");
    if (!title) return;

    try {
      await API.post("/api/tasks", {
        title,
        status: "pending",
        priority: "medium",
        category: "General"
      });

      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ MARK COMPLETE
  const markComplete = async (id, currentStatus) => {
    if (!editable) return;

    try {
      await API.put(`/api/tasks/${id}`, {
        status: currentStatus === "completed" ? "pending" : "completed"
      });

      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE TASK
  const deleteTask = async (id) => {
    if (!editable) return;

    try {
      await API.delete(`/api/tasks/${id}`);
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>

      {/* HEADER */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Tasks</h2>

        {editable && (
          <button className={styles.addBtn} onClick={addTask}>
            <FiPlus /> Add Task
          </button>
        )}
      </div>

      {/* TASK LIST */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              {editable && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id}>
                <td>{index + 1}</td>

                <td>{task.title}</td>

                <td>
                  <span
                    className={
                      task.status === "completed"
                        ? styles.completed
                        : styles.pending
                    }
                  >
                    {task.status}
                  </span>
                </td>

                <td>
                  <span className={styles.priority}>
                    {task.priority || "medium"}
                  </span>
                </td>

                {editable && (
                  <td className={styles.actions}>
                    <FiCheck
                      className={styles.complete}
                      onClick={() => markComplete(task._id, task.status)}
                    />

                    <FiTrash2
                      className={styles.delete}
                      onClick={() => deleteTask(task._id)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <p className={styles.empty}>No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default TaskTable;