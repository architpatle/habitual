import styles from "./Sidebar.module.css";
import {FiCalendar, FiBarChart2, FiClock, FiUser} from "react-icons/fi";
import {Link} from 'react-router-dom'

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <h2 className={styles.title}>Habitual</h2>

            <nav className={styles.nav}>
            
                <Link to='/' className={`${styles.navItem} ${styles.active}`}>
                    <FiCalendar className={`${styles.icon} ${styles.iconActive}`}/>
                    <span>Today</span>
                </Link>
               

                <Link to ='/status' className={styles.navItem}>
                    <FiBarChart2 className={styles.icon}/>
                                        <span>Status</span>

                </Link>

                <Link to='/history' className={styles.navItem}>
                    <FiClock className={styles.icon}/>
                                       <span>History</span>

                </Link>
            </nav>

            <div className={styles.footer}>
                <FiUser className={styles.icon}/>
                <span>User Name</span>
            </div>
        </aside>
    );
}

export default Sidebar;
