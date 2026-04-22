import React, { useState, useEffect } from "react";
import styles from "./TaskTable.module.css";
import { FiTrash2, FiPlus, FiEdit2 } from "react-icons/fi";
import TaskModal from "../TaskModal/TaskModal";

// 📅 Get current week key
const getCurrentWeekKey = () => {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);

  return `${now.getFullYear()}-W${week}`;
};

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
  const [showModal, setShowModal] = useState(false);

  // 🔥 NEW STATES FOR MODAL CONTROL
  const [modalMode, setModalMode] = useState("add");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [initialValue, setInitialValue] = useState("");

  // 🔁 Sync props → local state
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const data = localTasks;

  // ✅ FIX: fallback to current week
  const effectiveWeekKey = weekKey || getCurrentWeekKey();
  const weekDays = getWeekDatesFromKey(effectiveWeekKey);

  // ➕ / ✏️ SAVE HANDLER (ADD + EDIT)
  const handleSaveTask = (title) => {
    if (modalMode === "add") {
      const newTask = {
        id: Date.now(),
        title,
        days: Array(7).fill("empty"),
        weekKey: effectiveWeekKey
      };

      setLocalTasks(prev => [...prev, newTask]);

    } else if (modalMode === "edit") {
      setLocalTasks(prev =>
        prev.map(task =>
          task.id === editingTaskId
            ? { ...task, title }
            : task
        )
      );
    }
  };

  // ✏️ OPEN EDIT MODAL
  const editTask = (task) => {
    if (!editable) return;

    setModalMode("edit");
    setEditingTaskId(task.id);
    setInitialValue(task.title);
    setShowModal(true);
  };

  // ❌ DELETE TASK
  const deleteTask = (id) => {
    if (!editable) return;
    setLocalTasks(prev => prev.filter(t => t.id !== id));
  };

  // 🔁 TOGGLE DAY
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
          <button
            className={styles.addBtn}
            onClick={() => {
              setModalMode("add");
              setInitialValue("");
              setShowModal(true);
            }}
          >
            Add Task
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
                    <FiEdit2 className={styles.edit} onClick={() => editTask(task)} />
                    <FiTrash2 className={styles.del} onClick={() => deleteTask(task.id)} />
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

      {/* 🔥 MODAL (ADD + EDIT) */}
      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTask}
        mode={modalMode}
        initialValue={initialValue}
      />
    </div>
  );
};

export default TaskTable;