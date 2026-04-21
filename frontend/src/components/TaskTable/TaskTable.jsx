import React, { useState, useEffect } from "react";
import styles from "./TaskTable.module.css";
import { FiTrash2, FiPlus, FiEdit2 } from "react-icons/fi";

// 📅 Generate week days from weekKey
const getWeekDatesFromKey = (weekKey) => {
  if (!weekKey) return [];

  const [year, week] = weekKey.split("-W");
  const firstDay = new Date(year, 0, 1 + (week - 1) * 7);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(firstDay);
    d.setDate(firstDay.getDate() + i);

    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate()
    });
  }

  return days;
};

const TaskTable = ({
  tasks = [],
  editable = true,
  allowToggle = true,
  weekKey
}) => {

  const [localTasks, setLocalTasks] = useState(tasks);

  // 🔁 Sync props → local state
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const data = editable ? localTasks : localTasks; 
  // 🔥 Always use localTasks so toggle works in History

  const weekDays = getWeekDatesFromKey(weekKey);

  // ➕ ADD TASK
  const addTask = () => {
    if (!editable) return;

    const title = prompt("Enter task name:");
    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      days: Array(7).fill("empty")
    };

    setLocalTasks(prev => [...prev, newTask]);
  };

  // ✏️ EDIT TASK
  const editTask = (id) => {
    if (!editable) return;

    const newName = prompt("Edit task name:");
    if (!newName) return;

    setLocalTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, title: newName } : task
      )
    );
  };

  // ❌ DELETE TASK
  const deleteTask = (id) => {
    if (!editable) return;

    setLocalTasks(prev => prev.filter(t => t.id !== id));
  };

  // 🔁 FIXED TOGGLE (FINAL)
  const toggleDay = (taskId, dayIndex) => {
    if (!allowToggle) return;

    setLocalTasks(prev =>
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
    if (data.length === 0) return "--";

    let done = 0;
    data.forEach(t => {
      if (t.days[dayIndex] === "done") done++;
    });

    return Math.round((done / data.length) * 100) + "%";
  };

  return (
    <div className={styles.wrapper}>

      {/* HEADER */}
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Weekly Habit Tracker</h2>

        {editable && (
          <button className={styles.addBtn} onClick={addTask}>
            <FiPlus /> Add Task
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>

              {weekDays.map((d, i) => (
                <th key={i}>
                  {d.label}
                  <div className={styles.date}>({d.date})</div>
                </th>
              ))}

              <th>Avg</th>
              {editable && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((task, index) => (
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

                {editable && (
                  <td className={styles.actions}>
                    <FiEdit2 onClick={() => editTask(task.id)} />
                    <FiTrash2 onClick={() => deleteTask(task.id)} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td></td>
              <td className={styles.footerLabel}>Daily Avg</td>

              {weekDays.map((_, i) => (
                <td key={i} className={styles.footerCell}>
                  {computeDailyAvg(i)}
                </td>
              ))}

              <td></td>
              {editable && <td></td>}
            </tr>
          </tfoot>

        </table>

        {data.length === 0 && (
          <p className={styles.emptyText}>No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default TaskTable;