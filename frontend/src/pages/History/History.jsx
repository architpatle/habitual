import React, { useEffect, useState } from "react";
import styles from "./History.module.css";  // optional css, can reuse Today.css
import ScoreCard from "../../components/ScoreCard/ScoreCard";
import TaskTable from "../../components/TaskTable/TaskTable";

const History = () => {
  const [weeks, setWeeks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load archived weeks
  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then(res => res.json())
      .then(data => {
        setWeeks(data);
        if (data.length > 0) setSelectedIndex(0); // show latest week first
      });
  }, []);

  if (weeks.length === 0) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        <h2>No history available yet</h2>
        <p>Complete a full week to generate history.</p>
      </div>
    );
  }

  const selectedWeek = weeks[selectedIndex];

  // Compute Weekly Score (using archived finalized data)
  const computeWeekScore = () => {
    let done = 0, miss = 0;

    selectedWeek.tasks.forEach(t => {
      t.days.forEach(d => {
        if (d === "done") done++;
        if (d === "miss") miss++;
      });
    });

    const total = done + miss;
    if (total === 0) return "--";
    return Math.round((done / total) * 100);
  };

  const weekScore = computeWeekScore();

  return (
    <div className={styles.container}>
      
      {/* Week Selector */}
      <div className={styles.selectorRow}>
        <label>Week:&nbsp;</label>
        <select
          value={selectedIndex}
          onChange={e => setSelectedIndex(Number(e.target.value))}
          className={styles.selector}
        >
          {weeks.map((w, i) => (
            <option key={i} value={i}>
              {w.week}
            </option>
          ))}
        </select>
      </div>

      {/* Score Cards (only weekly) */}
      <div className={styles.scores}>
        <ScoreCard
          heading="Week's Score"
          score={weekScore}
          color={weekScore > 50 ? "green" : "red"}
        />
      </div>

      {/* Task Table (READ ONLY mode) */}
      <TaskTable 
  tasks={selectedWeek.tasks} 
  editable={false}
  weekKey={selectedWeek.week}
/>


    </div>
  );
};

export default History;
