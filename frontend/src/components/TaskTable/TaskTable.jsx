import React, { useEffect } from "react";
import styles from "./TaskTable.module.css";
import { FiCheck, FiX, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

// Generate current week dates (Today Page)
const getWeekDates = () => {
  const today = new Date();
  const week = [];
  const options = { weekday: "short" };

  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({
      label: d.toLocaleDateString("en-US", options),
      date: d.getDate()
    });
  }
  return week;
};

// Generate week dates from archived WeekKey (History Page)
const getDatesFromWeekKey = (weekKey) => {
  const [year, wk] = weekKey.split("-W").map(Number);
  const d = new Date(year, 0, 1);
  const day = d.getDay();
  const diff = (wk - 1) * 7 + (day <= 4 ? 1 - day : 8 - day);
  d.setDate(d.getDate() + diff);

  const arr = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(d);
    dt.setDate(d.getDate() + i);
    arr.push({
      label: dt.toLocaleDateString("en-US", { weekday: "short" }),
      date: dt.getDate()
    });
  }
  return arr;
};

const TaskTable = ({ tasks, setTasks, editable = true, weekKey }) => {

  // Fetch tasks only in Today Page (editable)
  useEffect(() => {
    if (!editable) return;
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error loading tasks:", err));
  }, [editable, setTasks]);

  // Save only in editable mode
  const save = (updatedTasks) => {
    if (!editable) return;
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTasks)
    });
  };

  const addTask = () => {
    if (!editable) return;
    const name = prompt("Enter new task:");
    if (!name) return;
    const newTask = { id: Date.now(), task: name, days: Array(7).fill("empty") };

    setTasks(prev => {
      const updated = [...prev, newTask];
      save(updated);
      return updated;
    });
  };

  const editTask = (id) => {
    if (!editable) return;
    const name = prompt("Rename task:");
    if (!name) return;

    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, task: name } : t);
      save(updated);
      return updated;
    });
  };

  const deleteTask = (id) => {
    if (!editable) return;
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      save(updated);
      return updated;
    });
  };

  const toggleDay = (taskId, dayIndex) => {
    if (!editable) return;

    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== taskId) return t;

        const sequence = ["empty", "done", "miss"];
        const next = sequence[(sequence.indexOf(t.days[dayIndex]) + 1) % sequence.length];

        return { ...t, days: t.days.map((d, i) => (i === dayIndex ? next : d)) };
      });

      save(updated);
      return updated;
    });
  };

  const computeAverage = (days) => {
    const done = days.filter(d => d === "done").length;
    const miss = days.filter(d => d === "miss").length;
    const empty = days.filter(d => d === "empty").length;
    const total = done + miss + empty;
    if (total === 0) return "--";
    return Math.round((done / total) * 100) + "%";
  };

  const computeDailyAverage = (tasks, dayIndex) => {
    let done = 0, miss = 0, empty = 0;
    tasks.forEach(t => {
      if (t.days[dayIndex] === "done") done++;
      if (t.days[dayIndex] === "miss") miss++;
      if (t.days[dayIndex] === "empty") empty++;
    });

    const total = done + miss + empty;
    if (total === 0) return "--";
    return Math.round((done / total) * 100) + "%";
  };

  // Choose dates source based on mode
  const weekDays = weekKey ? getDatesFromWeekKey(weekKey) : getWeekDates();

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Tasks List</h2>

        {editable && (
          <button className={styles.addBtn} onClick={addTask}>
            <FiPlus /> Add Task
          </button>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Tasks</th>

              {weekDays.map((d, idx) => (
                <th key={idx}>
                  {d.label} <span className={styles.date}>({d.date})</span>
                </th>
              ))}

              <th>Average</th>
              {editable && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {tasks.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.task}</td>

                {item.days.map((d, idx) => (
                  <td
                    key={idx}
                    onClick={editable ? () => toggleDay(item.id, idx) : undefined}
                  >
                    {d === "done" && <span className={`${styles.btn} ${styles.done}`}><FiCheck /></span>}
                    {d === "miss" && <span className={`${styles.btn} ${styles.miss}`}><FiX /></span>}
                    {d === "empty" && <span className={styles.btn}></span>}
                  </td>
                ))}

                <td>{computeAverage(item.days)}</td>

                {editable && (
                  <td className={styles.actions}>
                    <FiEdit2 onClick={() => editTask(item.id)} className={styles.edit} />
                    <FiTrash2 onClick={() => deleteTask(item.id)} className={styles.del} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td></td>
              <td className={styles.footerLabel}>Daily Average</td>

              {weekDays.map((d, idx) => (
                <td key={idx} className={styles.footerCell}>
                  {computeDailyAverage(tasks, idx)}
                </td>
              ))}

              <td></td>
              {editable && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
