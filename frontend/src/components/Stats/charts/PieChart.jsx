import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const PieChartComp = ({ tasks }) => {
  let done = 0, miss = 0;

  tasks.forEach(t => {
    t.days.forEach(d => {
      if (d === "done") done++;
      if (d === "miss") miss++;
    });
  });

  const data = [
    { name: "Done", value: done },
    { name: "Missed", value: miss }
  ];

  return (
    <PieChart width={260} height={220}>
  <Pie
    data={data}
    dataKey="value"
    outerRadius={80}
    fill="#00ff88"
  />
  <Tooltip />
</PieChart>
  );
};

export default PieChartComp;