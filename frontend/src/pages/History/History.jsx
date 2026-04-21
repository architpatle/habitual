import React, { useEffect, useState } from "react";
import styles from "./History.module.css";
import TaskTable from "../../components/TaskTable/TaskTable";
import WeekSelector from "../../components/WeekSelector/WeekSelector";

const getCurrentWeekKey = () => {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
};

const getPreviousWeekKey = () => {
  const current = getCurrentWeekKey();
  const [year, week] = current.split("-W");
  return `${year}-W${Number(week) - 1}`;
};

const History = () => {
  const [weeksMap, setWeeksMap] = useState({});
  const [selectedWeek, setSelectedWeek] = useState("");

  const previousWeek = getPreviousWeekKey();

  useEffect(() => {
    // 🔥 MOCK DATA (UI testing)
    const mockData = [
      {
        id: 1,
        title: "Gym",
        weekKey: "2026-W16",
        days: ["done", "done", "miss", "done", "empty", "done", "miss"]
      },
      {
        id: 2,
        title: "Study",
        weekKey: "2026-W16",
        days: ["done", "done", "done", "done", "done", "empty", "empty"]
      },
      {
        id: 3,
        title: "Reading",
        weekKey: "2026-W15",
        days: ["miss", "done", "done", "miss", "done", "done", "done"]
      },
      {
        id: 4,
        title: "Meditation",
        weekKey: "2026-W15",
        days: ["done", "done", "done", "done", "done", "done", "done"]
      }
    ];

    const grouped = mockData.reduce((acc, task) => {
      if (!acc[task.weekKey]) acc[task.weekKey] = [];
      acc[task.weekKey].push(task);
      return acc;
    }, {});

    setWeeksMap(grouped);

    const keys = Object.keys(grouped).sort().reverse();
    if (keys.length > 0) setSelectedWeek(keys[0]);

  }, []);

  const computeWeekScore = () => {
    const tasks = weeksMap[selectedWeek];
    if (!tasks) return "--";

    let done = 0, total = 0;

    tasks.forEach(t => {
      t.days.forEach(d => {
        if (d === "done") done++;
        if (d !== "empty") total++;
      });
    });

    return total === 0 ? "--" : Math.round((done / total) * 100);
  };

  if (!selectedWeek) {
    return <div className={styles.container}>No history</div>;
  }

  return (
    <div className={styles.container}>

      {/* 🔥 Enhanced Filter */}
      <WeekSelector
        weeks={Object.keys(weeksMap).sort().reverse()}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />

      {/* Score */}
      <div className={styles.scores}>
        <div>Week Score: {computeWeekScore()}%</div>
      </div>

      {/* 🔥 Task Table */}
      <TaskTable
        tasks={weeksMap[selectedWeek]}
        editable={false} // 🚫 no add/edit/delete
        allowToggle={selectedWeek === previousWeek} // 🔒 only last week editable
        weekKey={selectedWeek} // 📅 for dynamic dates
      />

    </div>
  );
};

export default History;