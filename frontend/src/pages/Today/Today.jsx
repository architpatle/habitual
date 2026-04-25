import React, { useEffect, useState } from "react";
import styles from "./Today.module.css";
import ScoreCard from "../../components/ScoreCard/ScoreCard";
import TaskTable from "../../components/TaskTable/TaskTable";
import API from "../../utils/api";

// 📅 Week Key (backend only)
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

// ✅ SINGLE SOURCE OF TRUTH (UI)
const getWeekDates = () => {
  const today = new Date();

  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  const days = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      fullDate: d.toDateString()
    });
  }

  return days;
};

const Today = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const weekKey = getCurrentWeekKey();
      const response = await API.get(`/tasks/current?weekKey=${weekKey}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔥 TODAY SCORE (CORRECT)
  const computeTodayScore = () => {
    if (tasks.length === 0) return "--";

    const weekDays = getWeekDates();
    const todayStr = new Date().toDateString();

    const todayIndex = weekDays.findIndex(
      d => d.fullDate === todayStr
    );

    if (todayIndex === -1) return "--";

    let done = 0;

    tasks.forEach(t => {
      if (t.days[todayIndex] === "done") done++;
    });

    return Math.round((done / tasks.length) * 100);
  };

  // 🔥 WEEK SCORE (CORRECT)
  const computeWeekScore = () => {
    if (tasks.length === 0) return "--";

    let done = 0;
    let total = 0;

    tasks.forEach(t => {
      t.days.forEach(d => {
        total++;
        if (d === "done") done++;
      });
    });

    return Math.round((done / total) * 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.scores}>
        <ScoreCard heading="Today’s Score" score={computeTodayScore()} color="green" />
        <ScoreCard heading="Week's Score" score={computeWeekScore()} color="green" />
      </div>

      <TaskTable
        tasks={tasks}
        refreshTasks={fetchTasks}
      />
    </div>
  );
};

export default Today;