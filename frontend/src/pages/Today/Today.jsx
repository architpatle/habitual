import React, {useEffect, useState} from 'react'
import styles from './Today.module.css'
import ScoreCard from '../../components/ScoreCard/ScoreCard'
import TaskTable from '../../components/TaskTable/TaskTable'

const Today = () => {
    const [tasks,
        setTasks] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/tasks")
            .then(res => res.json())
            .then(data => setTasks(data))
    }, [])

    const todayIndex = new Date().getDay() === 0
        ? 6
        : new Date().getDay() - 1

    const computeTodayScore = () => {
  let done = 0, miss = 0, empty = 0;

  tasks.forEach(t => {
    if (t.days[todayIndex] === "done") done++;
    if (t.days[todayIndex] === "miss") miss++;
    if (t.days[todayIndex] === "empty") empty++;
  });

  const total = done + miss + empty;
  if (total === 0) return "--";

  return Math.round((done / total) * 100);
};


    const computeWeekScore = () => {
  let done = 0, miss = 0, empty = 0;

  tasks.forEach(t => {
    t.days.forEach(d => {
      if (d === "done") done++;
      if (d === "miss") miss++;
      if (d === "empty") empty++;
    });
  });

  const total = done + miss + empty;
  if (total === 0) return "--";

  return Math.round((done / total) * 100);
};


    const todayScore = computeTodayScore()
    const weekScore = computeWeekScore()

    return (
        <div>
            <div className={styles.scores}>
                <ScoreCard
                    heading="Today’s Score"
                    score={todayScore}
                    color={todayScore > 50
                    ? "green"
                    : "red"}/>
                <ScoreCard
                    heading="Week's Score"
                    score={weekScore}
                    color={weekScore > 50
                    ? "green"
                    : "red"}/>
            </div>
            <TaskTable tasks={tasks} setTasks={setTasks}/>
        </div>
    )
}

export default Today
