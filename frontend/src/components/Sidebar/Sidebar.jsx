import styles from "./Sidebar.module.css";
import { FiCalendar, FiBarChart2, FiClock, FiUser, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* 🔥 Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.open : ""
        }`}
      >
        {/* 🔥 Close Button (Mobile) */}
        <div className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          <FiX />
        </div>

        <h2 className={styles.title}>Habitual</h2>

        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          } end>
            <FiCalendar className={styles.icon} />
            <span>Today</span>
          </NavLink>

          <NavLink to="/stats" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }>
            <FiBarChart2 className={styles.icon} />
            <span>Stats</span>
          </NavLink>

          <NavLink to="/history" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }>
            <FiClock className={styles.icon} />
            <span>History</span>
          </NavLink>
        </nav>

        <div className={styles.footer}>
          <FiUser className={styles.icon} />
          <span>Archit Patle</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;