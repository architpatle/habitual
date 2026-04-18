import React, { useEffect, useState } from "react";
import styles from "./History.module.css";
import ScoreCard from "../../components/ScoreCard/ScoreCard";
import TaskTable from "../../components/TaskTable/TaskTable";
import API from "../../utils/api";

const History = () => {
  const [weeks, setWeeks] = useState({});
  const [selectedWeek, setSelectedWeek] = useState("");

  // 🔥 Fetch history tasks
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get("/api/tasks/history");

        // 🧠 Group tasks by weekKey
        const grouped = data.reduce((acc, task) => {
          if (!acc[task.weekKey]) {
            acc[task.weekKey] = [];
          }
          acc[task.weekKey].push(task);
          return acc;
        }, {});

        setWeeks(grouped);

        // Set latest week as default
        const weekKeys = Object.keys(grouped).sort().reverse();
        if (weekKeys.length > 0) {
          setSelectedWeek(weekKeys[0]);
        }

      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  // 🧠 Compute Score
  const computeWeekScore = () => {
    if (!weeks[selectedWeek]) return "--";

    const tasks = weeks[selectedWeek];
    const completed = tasks.filter(t => t.status === "completed").length;
    const total = tasks.length;

    if (total === 0) return "--";

    return Math.round((completed / total) * 100);
  };

  const weekScore = computeWeekScore();

  if (!selectedWeek) {
    return (
      <div style={{ padding: "20px", color: "white" }}>
        <h2>No history available yet</h2>
        <p>Complete some tasks to generate history.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {/* 🔥 Week Selector */}
      <div className={styles.selectorRow}>
        <label>Week:&nbsp;</label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className={styles.selector}
        >
          {Object.keys(weeks)
            .sort()
            .reverse()
            .map((week) => (
              <option key={week} value={week}>
                {week}
              </option>
            ))}
        </select>
      </div>

      {/* 🔥 Score Card */}
      <div className={styles.scores}>
        <ScoreCard
          heading="Week's Score"
          score={weekScore}
          color={weekScore > 50 ? "green" : "red"}
        />
      </div>

      {/* 🔥 Task Table (Read Only) */}
      <TaskTable
        tasks={weeks[selectedWeek] || []}
        editable={false}
      />

    </div>
  );
};

export default History;