import React, { useState } from "react";
import styles from "./WeekSelector.module.css";

// Format label
const formatWeekLabel = (weekKey) => {
  const [year, week] = weekKey.split("-W");

  // 🔥 ISO week → get correct Monday
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();

  const monday = new Date(simple);
  monday.setDate(simple.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const options = { month: "short", day: "numeric" };

  return `Week ${week} • ${monday.toLocaleDateString("en-US", options)} - ${sunday.toLocaleDateString("en-US", options)}`;
};

const WeekSelector = ({ weeks, selectedWeek, setSelectedWeek }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>

      <label className={styles.label}>Select Week</label>

      {/* SELECT BOX */}
      <div
        className={styles.selectBox}
        onClick={() => setOpen(!open)}
      >
        {selectedWeek
          ? formatWeekLabel(selectedWeek)
          : "Choose a week"}
        <span className={styles.arrow}>▼</span>
      </div>

      {/* DROPDOWN LIST */}
      {open && (
        <div className={styles.dropdown}>
          {weeks.map((week) => (
            <div
              key={week}
              className={`${styles.option} ${
                selectedWeek === week ? styles.active : ""
              }`}
              onClick={() => {
                setSelectedWeek(week);
                setOpen(false);
              }}
            >
              {formatWeekLabel(week)}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default WeekSelector;