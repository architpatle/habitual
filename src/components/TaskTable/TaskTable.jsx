import React from 'react'
import styles from './TaskTable.module.css'
import { FiCheck, FiX } from 'react-icons/fi'

const data = [
  { id: 1, task: "Major Project", days: ["done", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 2, task: "Office Project", days: ["miss", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 3, task: "Study", days: ["done", "done", "empty", "empty", "empty", "empty", "empty"] },
  { id: 4, task: "Personal Project", days: ["done", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 5, task: "Content Creation", days: ["done", "empty", "empty", "empty", "empty", "empty", "empty"] },
  { id: 6, task: "Meditation", days: ["miss", "empty", "empty", "empty", "empty", "empty", "empty"] },
]

const TaskTable = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Tasks List</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Tasks</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
            <th>Average</th>
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
                  {d === null && <></>}
                </td>
              ))}
              <td>--</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable
