import styles from "./Sidebar.module.css";
import {
  FiCalendar,
  FiBarChart2,
  FiClock,
  FiUser,
  FiX,
  FiLogOut
} from "react-icons/fi";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  // Get current user
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsOpen(false);

    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.open : ""
        }`}
      >
        {/* Close Button */}
        <div
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
        >
          <FiX />
        </div>

        {/* App Title */}
        <h2 className={styles.title}>
          Habitual
        </h2>

        {/* Navigation */}
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
            end
            onClick={() => setIsOpen(false)}
          >
            <FiCalendar className={styles.icon} />
            <span>Today</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FiBarChart2 className={styles.icon} />
            <span>Stats</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.active : ""
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FiClock className={styles.icon} />
            <span>History</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <FiUser className={styles.icon} />
            <span>
              {user?.name || "Guest"}
            </span>
          </div>

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;