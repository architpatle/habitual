import React, { useEffect, useState } from "react";
import styles from "./History.module.css";
import TaskTable from "../../components/TaskTable/TaskTable";
import WeekSelector from "../../components/WeekSelector/WeekSelector";
import ScoreCard from "../../components/ScoreCard/ScoreCard";
import API from "../../utils/api";

// 📅 ISO Week (same as Today)
const getCurrentWeekKey = () => {
  const now = new Date();

  const date = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ));

  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);

  return `${date.getUTCFullYear()}-W${weekNo}`;
};

// 📅 Previous Week (safe)
const getPreviousWeekKey = () => {
  const now = new Date();
  now.setDate(now.getDate() - 7);

  const date = new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ));

  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);

  return `${date.getUTCFullYear()}-W${weekNo}`;
};

const History = () => {
  const [weeksMap, setWeeksMap] = useState({});
  const [selectedWeek, setSelectedWeek] = useState("");

  const previousWeek = getPreviousWeekKey();

  // 🔥 FETCH
  const fetchHistory = async () => {
    try {
      const response = await API.get("tasks/history");
      const data = response.data;

      const grouped = data.reduce((acc, task) => {
        if (!acc[task.weekKey]) acc[task.weekKey] = [];
        acc[task.weekKey].push(task);
        return acc;
      }, {});

      setWeeksMap(grouped);

      const keys = Object.keys(grouped)
        .sort()
        .reverse();

      // Only set initially
      setSelectedWeek((prev) =>
        prev || keys[0]
      );

    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 📊 WEEK SCORE
  const computeWeekScore = () => {
    const tasks = weeksMap[selectedWeek];
    if (!tasks) return "--";

    let done = 0;
    let total = 0;

    tasks.forEach(t => {
      t.days.forEach(d => {
        total++;
        if (d === "done") done++;
      });
    });

    return total === 0 ? "--" : Math.round((done / total) * 100);
  };

  if (!selectedWeek) {
    return <div className={styles.container}>No history</div>;
  }

  const weekScore = computeWeekScore();

  return (
    <div className={styles.container}>

      {/* 🔥 TOP BAR */}
      <div className={styles.topRow}>

        {/* LEFT → Selector */}
        <WeekSelector
          weeks={Object.keys(weeksMap).sort().reverse()}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />

        {/* RIGHT → Score Card */}
        <ScoreCard
          heading="Week Score"
          score={weekScore}
          color={weekScore > 50 ? "green" : "red"}
          icon="week"
          compact={true}   // 🔥 THIS IS THE KEY
        />

      </div>

      {/* 🔥 TABLE */}
      <TaskTable
        tasks={weeksMap[selectedWeek]}
        editable={false}
        allowToggle={selectedWeek === previousWeek}
        weekKey={selectedWeek}
        refreshTasks={fetchHistory}
      />

    </div>
  );
};

export default History;