import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const BarChartComp = ({ tasks = [] }) => {
  const data = tasks.map((task) => {
    const doneCount =
      task.days?.filter(
        (day) => day === "done"
      ).length || 0;

    const incompleteCount =
      task.days?.filter(
        (day) =>
          day === "miss" || day === "empty"
      ).length || 0;

    return {
      name: task.title,
      completed: doneCount,
      incomplete: incompleteCount
    };
  });

  // Dynamic label spacing
  const longestLabel = Math.max(
    ...tasks.map(
      (task) => task.title.length
    ),
    0
  );

  const labelHeight = Math.max(
    80,
    longestLabel * 8
  );

  return (
    <ResponsiveContainer
      width="100%"
      height={420}
    >
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 20
        }}
      >
        <XAxis
          dataKey="name"
          stroke="#aaa"
          angle={-90}
          textAnchor="end"
          interval={0}
          height={labelHeight}
        />

        <YAxis stroke="#aaa" />

        <Tooltip />

        <Legend />

        {/* Completed */}
        <Bar
          dataKey="completed"
          fill="#00C46A"
          radius={[4, 4, 0, 0]}
        />

        {/* Incomplete */}
        <Bar
          dataKey="incomplete"
          fill="#FF4D4D"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;