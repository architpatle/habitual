import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const BarChartComp = ({ tasks = [] }) => {
  const data = tasks.map((task) => {
    const doneCount =
      task.days?.filter((day) => day === "done").length || 0;

    return {
      name: task.title,
      value: doneCount
    };
  });

  // Longest label length
  const longestLabel = Math.max(
    ...tasks.map((task) => task.title.length),
    0
  );

  // Dynamic label area only
  const labelHeight = Math.max(80, longestLabel * 8);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 20   // keep this fixed
        }}
      >
        <XAxis
          dataKey="name"
          stroke="#aaa"
          angle={-90}
          textAnchor="end"
          interval={0}
          height={labelHeight}   // only labels expand
        />

        <YAxis stroke="#aaa" />

        <Tooltip />

        <Bar
          dataKey="value"
          fill="#0048FF"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;