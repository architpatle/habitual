import React, { useState, useEffect } from "react";
import styles from "./Stats.module.css";

import DateRangePicker from "../../components/Stats/DateRangePicker";
import LineChartComp from "../../components/Stats/charts/LineChart";
import BarChartComp from "../../components/Stats/charts/BarChart";
import PieChartComp from "../../components/Stats/charts/PieChart";

import API from "../../utils/api";

// 📅 ISO Current Week Key
const getCurrentWeekKey = () => {
  const now = new Date();

  const date = new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
  );

  date.setUTCDate(
    date.getUTCDate() + 4 - (date.getUTCDay() || 7)
  );

  const yearStart = new Date(
    Date.UTC(date.getUTCFullYear(), 0, 1)
  );

  const weekNo = Math.ceil(
    ((date - yearStart) / 86400000 + 1) / 7
  );

  return `${date.getUTCFullYear()}-W${weekNo}`;
};

// 📅 WeekKey → Monday Date
const getWeekStartDate = (weekKey) => {
  const [year, week] = weekKey.split("-W");

  const simple = new Date(
    year,
    0,
    1 + (week - 1) * 7
  );

  const dayOfWeek = simple.getDay();

  const monday = new Date(simple);

  monday.setDate(
    simple.getDate() -
      dayOfWeek +
      (dayOfWeek === 0 ? -6 : 1)
  );

  return monday;
};

const Stats = () => {
  const [tasks, setTasks] = useState([]);

  const [range, setRange] = useState({
    start: "",
    end: ""
  });

  // 🔥 Fetch stats data
  const fetchStatsData = async () => {
    try {
      const currentWeekKey = getCurrentWeekKey();

      const [historyRes, currentRes] =
        await Promise.all([
          API.get("/tasks/history"),
          API.get(
            `/tasks/current?weekKey=${currentWeekKey}`
          )
        ]);

      // Merge and remove duplicates
      const mergedTasks = [
        ...historyRes.data,
        ...currentRes.data
      ];

      const uniqueTasks = mergedTasks.filter(
        (task, index, self) =>
          index ===
          self.findIndex(
            (t) => t._id === task._id
          )
      );

      setTasks(uniqueTasks);

    } catch (error) {
      console.error(
        "Stats fetch error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  // 🔥 Date range filter
  const filteredTasks = tasks.filter(
    (task) => {
      if (!range.start || !range.end)
        return true;

      const weekStart = getWeekStartDate(
        task.weekKey
      );

      const start = new Date(range.start);
      const end = new Date(range.end);

      return (
        weekStart >= start &&
        weekStart <= end
      );
    }
  );

  return (
    <div className={styles.container}>

      {/* FILTER CARD */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>
          Filter by Date Range
        </h3>

        <DateRangePicker
          range={range}
          setRange={setRange}
        />
      </div>

      {/* CHARTS */}
      <div className={styles.grid}>

        {/* PIE */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            Completion Distribution
          </h3>

          <PieChartComp
            tasks={filteredTasks}
          />
        </div>

        {/* LINE */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            Daily Completion Trend
          </h3>

          <LineChartComp
            tasks={filteredTasks}
          />
        </div>

        {/* BAR */}
        <div
          className={`${styles.card} ${styles.fullWidth}`}
        >
          <h3 className={styles.cardTitle}>
            Task Performance
          </h3>

          <BarChartComp
            tasks={filteredTasks}
          />
        </div>

      </div>
    </div>
  );
};

export default Stats;