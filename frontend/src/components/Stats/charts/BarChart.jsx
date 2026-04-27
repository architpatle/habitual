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
  // Aggregate by task title
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const title = task.title;

      const doneCount =
        task.days?.filter(
          (day) => day === "done"
        ).length || 0;

      const incompleteCount =
        task.days?.filter(
          (day) =>
            day === "miss" || day === "empty"
        ).length || 0;

      if (!acc[title]) {
        acc[title] = {
          name: title,
          completed: 0,
          incomplete: 0
        };
      }

      acc[title].completed += doneCount;
      acc[title].incomplete += incompleteCount;

      return acc;
    },
    {}
  );

  const data = Object.values(groupedTasks);

  // Dynamic label spacing
  const longestLabel = Math.max(
    ...data.map((task) => task.name.length),
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

        <Bar
          dataKey="completed"
          fill="#00C46A"
          radius={[4, 4, 0, 0]}
        />

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