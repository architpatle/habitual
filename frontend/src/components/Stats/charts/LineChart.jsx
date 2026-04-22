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
  const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
    let done = 0;

    tasks.forEach(t => {
      if (t.days[i] === "done") done++;
    });

    return { day, value: done };
  });

  return (
    <LineChart width={300} height={220} data={data}>
      <CartesianGrid stroke="rgba(255,255,255,0.1)" />
      <XAxis dataKey="day" stroke="#aaa" />
      <YAxis stroke="#aaa" />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={2} />
    </LineChart>
  );
};

export default LineChartComp;