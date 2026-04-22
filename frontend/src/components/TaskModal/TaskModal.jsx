import React, { useState, useEffect } from "react";
import styles from "./TaskModal.module.css";

const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  mode = "add",
  initialValue = ""
}) => {
  const [title, setTitle] = useState("");

  // 🔁 Sync value when modal opens
  useEffect(() => {
    setTitle(initialValue || "");
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    onSave(title);
    setTitle("");
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h3 className={styles.heading}>
          {mode === "edit" ? "Edit Task" : "Add New Task"}
        </h3>

        <input
          type="text"
          placeholder="Enter task name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>
            Cancel
          </button>

          <button onClick={handleSave} className={styles.save}>
            {mode === "edit" ? "Save Changes" : "Add Task"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaskModal;