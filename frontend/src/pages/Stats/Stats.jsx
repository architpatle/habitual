import React, { useState, useEffect } from "react";
import styles from "./Stats.module.css";

import DateRangePicker from "../../components/Stats/DateRangePicker";
import LineChartComp from "../../components/Stats/charts/LineChart";
import BarChartComp from "../../components/Stats/charts/BarChart";
import PieChartComp from "../../components/Stats/charts/PieChart";
import API from "../../utils/api";

const getWeekStartDate = (weekKey) => {
  const [year, week] = weekKey.split("-W");

  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();

  const monday = new Date(simple);
  monday.setDate(simple.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  return monday;
};

const Stats = () => {
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState({
    start: "",
    end: ""
  });

  const fetchStatsData = async () => {
    try {
      const [historyRes, currentRes] = await Promise.all([
        API.get("/api/tasks/history"),
        API.get("/api/tasks/current")
      ]);

      const mergedTasks = [
        ...historyRes.data,
        ...currentRes.data
      ];

      setTasks(mergedTasks);

    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  // 🔥 Filter tasks based on selected date range
  const filteredTasks = tasks.filter((task) => {
    if (!range.start || !range.end) return true;

    const weekStart = getWeekStartDate(task.weekKey);

    const start = new Date(range.start);
    const end = new Date(range.end);

    return weekStart >= start && weekStart <= end;
  });

  return (
    <div className={styles.container}>

      {/* FILTER */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Filter by Date Range</h3>
        <DateRangePicker range={range} setRange={setRange} />
      </div>

      {/* CHARTS */}
      <div className={styles.grid}>

        {/* Pie */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            Completion Distribution
          </h3>
          <PieChartComp tasks={filteredTasks} />
        </div>

        {/* Line */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            Daily Completion Trend
          </h3>
          <LineChartComp tasks={filteredTasks} />
        </div>

        {/* Bar */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h3 className={styles.cardTitle}>
            Task Performance
          </h3>
          <BarChartComp tasks={filteredTasks} />
        </div>

      </div>
    </div>
  );
};

export default Stats;