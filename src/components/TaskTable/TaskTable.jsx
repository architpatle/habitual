import React from 'react'
import styles from './TaskTable.module.css'
import { FiCheck, FiX, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

const data = [
  { id: 1, task: "Major Project", days: ["done", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 2, task: "Office Project", days: ["miss", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 3, task: "Study", days: ["done", "done", "empty", "empty", "empty", "empty", "empty"] },
  { id: 4, task: "Personal Project", days: ["done", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 5, task: "Content Creation", days: ["done", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 6, task: "Meditation", days: ["miss", "empty", "empty", "empty", "empty", "empty", "empty"] },
]

// Generate weekdays with dates dynamically
const getWeekDates = () => {
  const today = new Date();
  const week = [];
  const options = { weekday: 'short' };

  // Make Monday the start of week
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({
      label: d.toLocaleDateString('en-US', options),
      date: d.getDate()
    });
  }
  return week;
}

const weekDays = getWeekDates();

const TaskTable = () => {
  return (
    <div className={styles.wrapper}>
      
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Tasks List</h2>

        {/* Add Task Button */}
        <button className={styles.addBtn}>
           Add Task
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Tasks</th>

            {/* Weekdays with Dates */}
            {weekDays.map((d, idx) => (
              <th key={idx}>{d.label} <span className={styles.date}>( {d.date} )</span></th>
            ))}

            <th>Average</th>
            <th>Actions</th> {/* NEW COLUMN */}
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={item.id}>
              <td>{i + 1}</td>
              <td>{item.task}</td>

              {item.days.map((d, idx) => (
                <td key={idx}>
                  {d === "done" && <span className={`${styles.btn} ${styles.done}`}><FiCheck /></span>}
                  {d === "miss" && <span className={`${styles.btn} ${styles.miss}`}><FiX /></span>}
                  {d === "empty" && <span className={styles.btn}></span>}
                </td>
              ))}

              <td>--</td>

              {/* Actions Column */}
              <td className={styles.actions}>
                <FiEdit2 className={styles.edit} />
                <FiTrash2 className={styles.del} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable
