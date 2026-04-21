import React from "react";
import styles from "./DateRangePicker.module.css";

const DateRangePicker = ({ range, setRange }) => {
  return (
    <div className={styles.wrapper}>
      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={range.start}
          onChange={(e) =>
            setRange({ ...range, start: e.target.value })
          }
        />
      </div>

      <div>
        <label>End Date</label>
        <input
          type="date"
          value={range.end}
          onChange={(e) =>
            setRange({ ...range, end: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default DateRangePicker;