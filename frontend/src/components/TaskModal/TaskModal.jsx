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

  // Sync value when modal opens
  useEffect(() => {
    setTitle(initialValue || "");
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  // Handle form submit (button + Enter key)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSave(title.trim());
    setTitle("");
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h3 className={styles.heading}>
          {mode === "edit"
            ? "Edit Task"
            : "Add New Task"}
        </h3>

        {/* Form enables Enter key submit */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter task name..."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className={styles.input}
            autoFocus
          />

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.save}
            >
              {mode === "edit"
                ? "Save Changes"
                : "Add Task"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TaskModal;