import React, { useState, useEffect } from "react";
import styles from "./Stats.module.css";

import DateRangePicker from "../../components/Stats/DateRangePicker";
import LineChartComp from "../../components/Stats/charts/LineChart";
import BarChartComp from "../../components/Stats/charts/BarChart";
import PieChartComp from "../../components/Stats/charts/PieChart";

const Stats = () => {
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const mockData = [
      {
        title: "Gym",
        days: ["done", "done", "miss", "done", "empty", "done", "miss"]
      },
      {
        title: "Study",
        days: ["done", "done", "done", "done", "done", "empty", "empty"]
      }
    ];
    setTasks(mockData);
  }, []);

  return (
    <div className={styles.container}>

      {/* 🔥 FILTER CARD */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Filter by Date Range</h3>
        <DateRangePicker range={range} setRange={setRange} />
      </div>

      {/* 🔥 CHART GRID */}
      <div className={styles.grid}>

        {/* Row 1 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Completion Distribution</h3>
          <PieChartComp tasks={tasks} />
        </div>

        
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Daily Completion Trend</h3>
          <LineChartComp tasks={tasks} />
        </div>

        {/* Row 2 (FULL WIDTH) */}
       <div className={`${styles.card} ${styles.fullWidth}`}>
          <h3 className={styles.cardTitle}>Task Performance</h3>
          <BarChartComp tasks={tasks} />
        </div>

      </div>
    </div>
  );
};

export default Stats;