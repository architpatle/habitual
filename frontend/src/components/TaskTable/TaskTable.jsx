import React, {useState, useEffect} from "react";
import styles from "./TaskTable.module.css";
import {FiCheck, FiX, FiEdit2, FiTrash2, FiPlus} from "react-icons/fi";

const getWeekDates = () => {
    const today = new Date();
    const week = [];
    const options = {
        weekday: "short"
    };

    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0
        ? 6
        : day - 1));

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

const weekDays = getWeekDates();

const TaskTable = () => {
    const [tasks,
        setTasks] = useState([]);
    const [loaded,
        setLoaded] = useState(false); // prevents overwrite on refresh

    // Load tasks from backend
    useEffect(() => {
        fetch("http://localhost:5000/tasks")
            .then(res => res.json())
            .then(data => {
                setTasks(data);
                setLoaded(true); // allow POST only after GET
            })
            .catch(err => console.error("Error loading tasks:", err));
    }, []);

    // Save tasks to backend
    useEffect(() => {
        if (!loaded) 
            return; // prevents writing empty array on startup
        
        fetch("http://localhost:5000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tasks)
        }).catch(err => console.error("Error saving tasks:", err));
    }, [tasks, loaded]);

    const addTask = () => {
        const name = prompt("Enter new task:");
        if (!name) 
            return;
        
        const newTask = {
            id: Date.now(),
            task: name,
            days: Array(7).fill("empty")
        };

        setTasks(prev => [
            ...prev,
            newTask
        ]);
    };

    const editTask = (id) => {
        const name = prompt("Rename task:");
        if (!name) 
            return;
        
        setTasks(prev => prev.map(t => (t.id === id
            ? {
                ...t,
                task: name
            }
            : t)));
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const toggleDay = (taskId, dayIndex) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) 
                return t;
            
            const sequence = ["empty", "done", "miss"];
            const current = t.days[dayIndex];
            const next = sequence[(sequence.indexOf(current) + 1) % sequence.length];

            return {
                ...t,
                days: t
                    .days
                    .map((d, i) => (i === dayIndex
                        ? next
                        : d))
            };
        }));
    };

    const computeAverage = (days) => {
        const done = days
            .filter(d => d === "done")
            .length;
        const miss = days
            .filter(d => d === "miss")
            .length;
        if (done + miss === 0) 
            return "--";
        return Math.round((done / (done + miss)) * 100) + "%";
    };

    const computeDailyAverage = (tasks, dayIndex) => {
        let done = 0,
            miss = 0;

        tasks.forEach(t => {
            if (t.days[dayIndex] === "done") 
                done++;
            if (t.days[dayIndex] === "miss") 
                miss++;
            }
        );

        if (done + miss === 0) 
            return "--";
        
        return Math.round((done / (done + miss)) * 100) + "%";
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Tasks List</h2>
                <button className={styles.addBtn} onClick={addTask}>
                    <FiPlus/>
                    Add Task
                </button>
            </div>
<div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Tasks</th>

                        {weekDays.map((d, idx) => (
                            <th key={idx}>
                                {d.label}
                                <span className={styles.date}>({d.date})</span>
                            </th>
                        ))}

                        <th>Average</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tasks.map((item, i) => (
                        <tr key={item.id}>
                            <td>{i + 1}</td>
                            <td>{item.task}</td>

                            {item
                                .days
                                .map((d, idx) => (
                                    <td key={idx} onClick={() => toggleDay(item.id, idx)}>
                                        {d === "done" && (
                                            <span className={`${styles.btn} ${styles.done}`}>
                                                <FiCheck/>
                                            </span>
                                        )}
                                        {d === "miss" && (
                                            <span className={`${styles.btn} ${styles.miss}`}>
                                                <FiX/>
                                            </span>
                                        )}
                                        {d === "empty" && <span className={styles.btn}></span>}
                                    </td>
                                ))}

                            <td>{computeAverage(item.days)}</td>

                            <td className={styles.actions}>
                                <FiEdit2 onClick={() => editTask(item.id)} className={styles.edit}/>
                                <FiTrash2 onClick={() => deleteTask(item.id)} className={styles.del}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
  <tr>
    <td></td>
    <td className={styles.footerLabel}>Daily Average</td>

    {weekDays.map((d, i) => (
      <td key={i} className={styles.footerCell}>
        {computeDailyAverage(tasks, i)}
      </td>
    ))}

    <td></td>
    <td></td>
  </tr>
</tfoot>

            </table>
            </div>
        </div>
    );
};

export default TaskTable;
