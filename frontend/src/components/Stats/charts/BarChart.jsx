import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const BarChartComp = ({ tasks }) => {
  const data = tasks.map(t => {
    const done = t.days.filter(d => d === "done").length;
    return { name: t.title, value: done };
  });

  return (
    <BarChart width={400} height={250} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#0048FF" />
    </BarChart>
  );
};

export default BarChartComp;