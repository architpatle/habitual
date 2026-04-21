import React, { useState } from "react";
import styles from "./WeekSelector.module.css";

// Format label
const formatWeekLabel = (weekKey) => {
  const [year, week] = weekKey.split("-W");

  const firstDay = new Date(year, 0, 1 + (week - 1) * 7);

  const start = new Date(firstDay);
  const end = new Date(firstDay);
  end.setDate(start.getDate() + 6);

  const options = { month: "short", day: "numeric" };

  return `Week ${week} • ${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
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