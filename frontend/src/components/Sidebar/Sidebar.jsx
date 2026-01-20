import styles from "./Sidebar.module.css";
import { FiCalendar, FiBarChart2, FiClock, FiUser } from "react-icons/fi";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Habitual</h2>

      <nav className={styles.nav}>

        <NavLink 
          to="/"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
          end
        >
          <FiCalendar className={styles.icon} />
          <span>Today</span>
        </NavLink>

        <NavLink 
          to="/status"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <FiBarChart2 className={styles.icon} />
          <span>Status</span>
        </NavLink>

        <NavLink 
          to="/history"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <FiClock className={styles.icon} />
          <span>History</span>
        </NavLink>

      </nav>

      <div className={styles.footer}>
        <FiUser className={styles.icon} />
        <span>Archit Patle</span>
      </div>
    </aside>
  );
};

export default Sidebar;
