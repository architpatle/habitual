import React, { useState, useEffect } from "react";
import styles from "./Stats.module.css";
import DateRangePicker from "../../components/Stats/DateRangePicker";
import LineChartComp from "../../components/Stats/charts/LineChart";
import BarChartComp from "../../components/Stats/charts/BarChart";
import PieChartComp from "../../components/Stats/charts/PieChart";

const Stats = () => {
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState({
    start: "",
    end: ""
  });

  // 🔥 MOCK DATA (replace later with backend)
  useEffect(() => {
    const mockData = [
      {
        title: "Gym",
        weekKey: "2026-W16",
        days: ["done", "done", "miss", "done", "empty", "done", "miss"]
      },
      {
        title: "Study",
        weekKey: "2026-W16",
        days: ["done", "done", "done", "done", "done", "empty", "empty"]
      }
    ];

    setTasks(mockData);
  }, []);

  return (
    <div className={styles.container}>

      {/* 📅 FILTER */}
      <DateRangePicker range={range} setRange={setRange} />

      {/* 📊 CHARTS */}
      <div className={styles.grid}>
        <LineChartComp tasks={tasks} />
        <BarChartComp tasks={tasks} />
        <PieChartComp tasks={tasks} />
      </div>

    </div>
  );
};

export default Stats;