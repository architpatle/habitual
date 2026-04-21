import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const LineChartComp = ({ tasks }) => {
  const data = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, i) => {
    let done = 0;

    tasks.forEach(t => {
      if (t.days[i] === "done") done++;
    });

    return { day, value: done };
  });

  return (
    <LineChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#00ff88" />
    </LineChart>
  );
};

export default LineChartComp;