import styles from "./Sidebar.module.css";
import { FiCalendar, FiBarChart2, FiClock, FiUser } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Habitual</h2>

      <nav className={styles.nav}>
        <div className={`${styles.navItem} ${styles.active}`}>
          <FiCalendar className={styles.icon} />
          <span>Today</span>
        </div>

        <div className={styles.navItem}>
          <FiBarChart2 className={styles.icon} />
          <span>Status</span>
        </div>

        <div className={styles.navItem}>
          <FiClock className={styles.icon} />
          <span>History</span>
        </div>
      </nav>

      <div className={styles.footer}>
        <FiUser className={styles.icon} />
        <span>User Name</span>
      </div>
    </aside>
  );
}

export default Sidebar;
