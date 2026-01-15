import React from 'react'
import styles from './Today.module.css'
import ScoreCard from '../../components/ScoreCard/ScoreCard'

const Today = () => {
    return (
        <div>
            <div className={styles.scores}>
                <ScoreCard heading="Today’s Score" score="87" color="green"/>
                <ScoreCard icon="week" heading="Week's Score" score="45" color="red"/>
            </div>
        </div>
    )
}

export default Today