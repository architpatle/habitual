import React, { useEffect, useState } from "react";
import styles from "./Today.module.css";
import ScoreCard from "../../components/ScoreCard/ScoreCard";
import TaskTable from "../../components/TaskTable/TaskTable";
import API from "../../utils/api";

const Today = () => {
  const [tasks, setTasks] = useState([]);

  // 🔥 Fetch Current Week Tasks
  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/api/tasks/current");
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🧠 TODAY SCORE (based on completion)
  const computeTodayScore = () => {
    if (tasks.length === 0) return "--";

    const completed = tasks.filter(t => t.status === "completed").length;
    const total = tasks.length;

    return Math.round((completed / total) * 100);
  };

  // 🧠 WEEK SCORE (same as today for now)
  const computeWeekScore = () => {
    if (tasks.length === 0) return "--";

    const completed = tasks.filter(t => t.status === "completed").length;
    const total = tasks.length;

    return Math.round((completed / total) * 100);
  };

  const todayScore = computeTodayScore();
  const weekScore = computeWeekScore();

  return (
    <div className={styles.container}>
      <div className={styles.scores}>
        <ScoreCard
          heading="Today’s Score"
          score={todayScore}
          color={todayScore > 50 ? "green" : "red"}
        />
        <ScoreCard
          heading="Week's Score"
          score={weekScore}
          color={weekScore > 50 ? "green" : "red"}
        />
      </div>

      {/* 🔥 Pass fetchTasks so table can refresh */}
      <TaskTable tasks={tasks} setTasks={setTasks} refreshTasks={fetchTasks} />
    </div>
  );
};

export default Today;