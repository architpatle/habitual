import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const Stats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await API.get("/api/tasks/stats");
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Stats</h2>

      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Pending: {stats.pending}</p>
      <p>Completion Rate: {stats.completionRate}%</p>
    </div>
  );
};

export default Stats;