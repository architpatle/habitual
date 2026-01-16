import React from 'react'
import {FiCalendar} from "react-icons/fi";
import {PiRanking} from "react-icons/pi";
import styles from "./ScoreCard.module.css"

const ScoreCard = (props) => {
    return (
        <div className={styles.scoreCard}>
            <div className={styles.icon}>
                {props.icon === "week"
                    ? <FiCalendar/>
                    : <PiRanking/>}</div>
            <div className={styles.text}>
                <h2>{props.heading}</h2>
                <p
                    className={props.color === "red"
                    ? styles.red
                    : styles.green}>{props.score}%</p>
            </div>
        </div>
    )
}

export default ScoreCard