import React, { useState } from "react";
import styles from "./TaskTable.module.css";
import { FiTrash2, FiPlus } from "react-icons/fi";

const daysLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);

  // ➕ ADD TASK
  const addTask = () => {
    const title = prompt("Enter task name:");
    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      days: Array(7).fill("empty") // 🔥 tri-state
    };

    setTasks(prev => [...prev, newTask]);
  };

  // ❌ DELETE TASK
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // 🔁 TRI-STATE TOGGLE
  const toggleDay = (taskId, dayIndex) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId) return task;

        const sequence = ["empty", "done", "miss"];
        const current = task.days[dayIndex];
        const next = sequence[(sequence.indexOf(current) + 1) % 3];

        const updatedDays = [...task.days];
        updatedDays[dayIndex] = next;

        return { ...task, days: updatedDays };
      })
    );
  };

  // 📊 TASK AVG
  const computeTaskAvg = (days) => {
    const done = days.filter(d => d === "done").length;
    return Math.round((done / 7) * 100);
  };

  // 📊 DAILY AVG
  const computeDailyAvg = (dayIndex) => {
    if (tasks.length === 0) return "--";

    let done = 0;
    tasks.forEach(t => {
      if (t.days[dayIndex] === "done") done++;
    });

    return Math.round((done / tasks.length) * 100) + "%";
  };

  return (
    <div className={styles.wrapper}>

      {/* HEADER */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Weekly Habit Tracker</h2>

        <button className={styles.addBtn} onClick={addTask}>
          <FiPlus /> Add Task
        </button>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>

              {daysLabels.map((d, i) => (
                <th key={i}>{d}</th>
              ))}

              <th>Avg</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>

                {task.days.map((d, i) => (
                  <td key={i}>
                    <div
                      className={`${styles.cell} ${
                        d === "done"
                          ? styles.done
                          : d === "miss"
                          ? styles.miss
                          : styles.empty
                      }`}
                      onClick={() => toggleDay(task.id, i)}
                    >
                      {d === "done" && "✓"}
                      {d === "miss" && "✕"}
                      {d === "empty" && "–"}
                    </div>
                  </td>
                ))}

                <td>{computeTaskAvg(task.days)}%</td>

                <td>
                  <FiTrash2
                    className={styles.delete}
                    onClick={() => deleteTask(task.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>

          {/* FOOTER */}
          <tfoot>
            <tr>
              <td></td>
              <td className={styles.footerLabel}>Daily Avg</td>

              {daysLabels.map((_, i) => (
                <td key={i}>{computeDailyAvg(i)}</td>
              ))}

              <td></td>
              <td></td>
            </tr>
          </tfoot>

        </table>

        {tasks.length === 0 && (
          <p className={styles.emptyText}>No tasks added yet</p>
        )}
      </div>
    </div>
  );
};

export default TaskTable;