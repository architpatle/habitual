import React from 'react'
import styles from './Navbar.module.css'

const Navbar = () => {
    const date = new Date();

    const dateDay = date.toLocaleString('en-GB', {
        weekday: 'short', // Mon
        day: '2-digit', // 14
        month: 'short', // Jan
        year: 'numeric' // 2026
    });
    return (
        <nav className={styles.navbar}>
            <h1 className={styles.heading}>Habitual : Track Your Habit Effectively</h1>
            <div className={styles.dateDay}>
                {dateDay}
            </div>
        </nav>
    )
}

export default Navbar