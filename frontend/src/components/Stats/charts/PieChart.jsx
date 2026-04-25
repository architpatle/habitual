import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const PieChartComp = ({ tasks = [] }) => {
  let done = 0;
  let miss = 0;
  let empty = 0;

  tasks.forEach((task) => {
    task.days?.forEach((day) => {
      if (day === "done") done++;
      if (day === "miss") miss++;
      if (day === "empty") empty++;
    });
  });

  const data = [
    { name: "Done", value: done },
    { name: "Missed", value: miss },
    { name: "Untouched", value: empty }
  ];

  const COLORS = [
    "#00ff88",
    "#ff4d4d",
    "#888888"
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={90}
          innerRadius={40}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComp;