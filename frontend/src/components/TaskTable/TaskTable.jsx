import React, { useState, useEffect } from "react";
import styles from "./TaskTable.module.css";
import {
  FiTrash2,
  FiEdit2,
  FiMenu
} from "react-icons/fi";

import TaskModal from "../TaskModal/TaskModal";
import API from "../../utils/api";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// 📅 Get current week key
const getCurrentWeekKey = () => {
  const now = new Date();

  const date = new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
  );

  date.setUTCDate(
    date.getUTCDate() + 4 - (date.getUTCDay() || 7)
  );

  const yearStart = new Date(
    Date.UTC(date.getUTCFullYear(), 0, 1)
  );

  const weekNo = Math.ceil(
    ((date - yearStart) / 86400000 + 1) / 7
  );

  return `${date.getUTCFullYear()}-W${weekNo}`;
};

// 📅 Generate week days
const getWeekDates = () => {
  const today = new Date();

  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  const days = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    days.push({
      label: d.toLocaleDateString(
        "en-US",
        { weekday: "short" }
      ),
      date: d.getDate()
    });
  }

  return days;
};

// Sortable Row
const SortableRow = ({
  task,
  index,
  editable,
  allowToggle,
  toggleDay,
  editTask,
  deleteTask,
  computeTaskAvg
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={isDragging ? styles.dragging : ""}
    >
      <td>{index + 1}</td>

      <td>{task.title}</td>

      {task.days.map((d, i) => (
        <td key={i}>
          <div
            className={`${styles.cell} ${d === "done"
              ? styles.done
              : d === "miss"
                ? styles.miss
                : styles.empty
              }`}
            onClick={() =>
              toggleDay(task._id, i)
            }
          >
            {d === "done" && "✓"}
            {d === "miss" && "✕"}
            {d === "empty" && "–"}
          </div>
        </td>
      ))}

      <td>
        {computeTaskAvg(task.days)}%
      </td>

      {editable && (
        <td className={styles.actionsCell}>
          <div className={styles.actions}>
            <FiEdit2
              className={styles.edit}
              onClick={() =>
                editTask(task)
              }
            />

            <FiTrash2
              className={styles.del}
              onClick={() =>
                deleteTask(task._id)
              }
            />

            <FiMenu
              className={styles.dragHandle}
              {...attributes}
              {...listeners}
            />
          </div>
        </td>
      )}
    </tr>
  );
};

const TaskTable = ({
  tasks = [],
  editable = true,
  allowToggle = true,
  weekKey,
  refreshTasks
}) => {
  const [localTasks, setLocalTasks] =
    useState(tasks);

  const [showModal, setShowModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("add");

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [initialValue, setInitialValue] =
    useState("");

  const [deletedTask, setDeletedTask] =
    useState(null);

  const [deletedTaskIndex, setDeletedTaskIndex] =
    useState(null);

  const [deleteTimer, setDeleteTimer] =
    useState(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const effectiveWeekKey =
    weekKey || getCurrentWeekKey();

  const weekDays = getWeekDates();

  // Add / Edit
  const handleSaveTask = async (
    title
  ) => {
    try {
      if (modalMode === "add") {
        await API.post("/tasks", {
          title,
          weekKey: effectiveWeekKey
        });
      } else {
        await API.patch(
          `/tasks/${editingTaskId}`,
          { title }
        );
      }

      await refreshTasks();
      setShowModal(false);

    } catch (err) {
      console.error(
        "Edit error:",
        err
      );
    }
  };

  // Edit
  const editTask = (task) => {
    if (!editable) return;

    setModalMode("edit");
    setEditingTaskId(task._id);
    setInitialValue(task.title);
    setShowModal(true);
  };

  // Delete
  const deleteTask = async (id) => {
    if (!editable) return;

    const taskIndex =
      localTasks.findIndex(
        (task) => task._id === id
      );

    const taskToDelete =
      localTasks[taskIndex];

    if (!taskToDelete) return;

    const updatedTasks =
      localTasks.filter(
        (task) => task._id !== id
      );

    setLocalTasks(updatedTasks);

    setDeletedTask(taskToDelete);
    setDeletedTaskIndex(taskIndex);

    const timer = setTimeout(
      async () => {
        try {
          await API.delete(
            `/tasks/${id}`
          );

          refreshTasks &&
            refreshTasks();

        } catch (err) {
          console.error(err);
        }

        setDeletedTask(null);
        setDeletedTaskIndex(null);
      },
      5000
    );

    setDeleteTimer(timer);
  };

  // Undo Delete Task
  const handleUndoDelete = () => {
    if (!deletedTask) return;

    clearTimeout(deleteTimer);

    const restoredTasks = [
      ...localTasks
    ];

    restoredTasks.splice(
      deletedTaskIndex,
      0,
      deletedTask
    );

    setLocalTasks(restoredTasks);

    setDeletedTask(null);
    setDeletedTaskIndex(null);
  };

  // Toggle day
  const toggleDay = async (
    taskId,
    dayIndex
  ) => {
    if (!allowToggle) return;

    const task = localTasks.find(
      (t) => t._id === taskId
    );

    const sequence = [
      "empty",
      "done",
      "miss"
    ];

    const current =
      task.days[dayIndex];

    const next =
      sequence[
      (sequence.indexOf(
        current
      ) +
        1) %
      3
      ];

    try {
      await API.patch(
        `/tasks/${taskId}/day`,
        {
          dayIndex,
          value: next
        }
      );

      refreshTasks &&
        refreshTasks();

    } catch (err) {
      console.error(err);
    }
  };

  // Drag End
  const handleDragEnd = async (
    event
  ) => {
    const {
      active,
      over
    } = event;

    if (
      !over ||
      active.id === over.id
    )
      return;

    const oldIndex =
      localTasks.findIndex(
        (task) =>
          task._id === active.id
      );

    const newIndex =
      localTasks.findIndex(
        (task) =>
          task._id === over.id
      );

    const reordered =
      arrayMove(
        localTasks,
        oldIndex,
        newIndex
      );

    setLocalTasks(reordered);

    try {
      await API.patch(
        "/tasks/reorder",
        {
          tasks:
            reordered.map(
              (
                task,
                index
              ) => ({
                id: task._id,
                order:
                  index + 1
              })
            )
        }
      );

      refreshTasks &&
        refreshTasks();

    } catch (err) {
      console.error(
        "Reorder error:",
        err
      );
    }
  };

  const computeTaskAvg = (
    days
  ) => {
    const done =
      days.filter(
        (d) => d === "done"
      ).length;

    return Math.round(
      (done / 7) * 100
    );
  };

  const computeDailyAvg = (
    dayIndex
  ) => {
    if (
      localTasks.length === 0
    )
      return "--";

    let done = 0;

    localTasks.forEach(
      (t) => {
        if (
          t.days[
          dayIndex
          ] === "done"
        )
          done++;
      }
    );

    return (
      Math.round(
        (done /
          localTasks.length) *
        100
      ) + "%"
    );
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={
          styles.headerRow
        }
      >
        <h2
          className={
            styles.title
          }
        >
          Weekly Habit Tracker
        </h2>

        {editable && (
          <button
            className={
              styles.addBtn
            }
            onClick={() => {
              setModalMode(
                "add"
              );
              setInitialValue(
                ""
              );
              setShowModal(
                true
              );
            }}
          >
            Add Task
          </button>
        )}
      </div>

      <div
        className={
          styles.tableWrapper
        }
      >
        <DndContext
          collisionDetection={
            closestCenter
          }
          onDragEnd={
            handleDragEnd
          }
        >
          <table
            className={
              styles.table
            }
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Task</th>

                {weekDays.map(
                  (
                    d,
                    i
                  ) => (
                    <th
                      key={i}
                    >
                      {d.label}
                      <div
                        className={
                          styles.date
                        }
                      >
                        ({d.date})
                      </div>
                    </th>
                  )
                )}

                <th>Avg</th>
                {editable && (
                  <th>
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <SortableContext
              items={localTasks.map(
                (task) =>
                  task._id
              )}
              strategy={
                verticalListSortingStrategy
              }
            >
              <tbody>
                {localTasks.map(
                  (task, index) => (
                    <React.Fragment
                      key={task._id}
                    >
                      {/* Insert undo row exactly where deleted */}
                      {deletedTask &&
                        deletedTaskIndex ===
                        index && (
                          <tr
                            className={
                              styles.undoRow
                            }
                          >
                            <td
                              colSpan={
                                editable
                                  ? 11
                                  : 10
                              }
                            >
                              <div
                                className={
                                  styles.undoInline
                                }
                              >
                                <span>
                                  Task deleted
                                </span>

                                <button
                                  onClick={
                                    handleUndoDelete
                                  }
                                  className={
                                    styles.undoBtn
                                  }
                                >
                                  Undo
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}

                      <SortableRow
                        task={task}
                        index={index}
                        editable={editable}
                        allowToggle={allowToggle}
                        toggleDay={toggleDay}
                        editTask={editTask}
                        deleteTask={deleteTask}
                        computeTaskAvg={
                          computeTaskAvg
                        }
                      />
                    </React.Fragment>
                  )
                )}

                {/* Edge case:
      deleted last row */}
                {deletedTask &&
                  deletedTaskIndex ===
                  localTasks.length && (
                    <tr
                      className={
                        styles.undoRow
                      }
                    >
                      <td
                        colSpan={
                          editable ? 11 : 10
                        }
                      >
                        <div
                          className={
                            styles.undoInline
                          }
                        >
                          <span>
                            Task deleted
                          </span>

                          <button
                            onClick={
                              handleUndoDelete
                            }
                            className={
                              styles.undoBtn
                            }
                          >
                            Undo
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </SortableContext>

            <tfoot>
              <tr>
                <td></td>

                <td
                  className={
                    styles.footerLabel
                  }
                >
                  Daily Avg
                </td>

                {weekDays.map(
                  (_, i) => (
                    <td
                      key={i}
                      className={
                        styles.footerCell
                      }
                    >
                      {computeDailyAvg(
                        i
                      )}
                    </td>
                  )
                )}

                <td></td>
                {editable && (
                  <td></td>
                )}
              </tr>
            </tfoot>
          </table>
        </DndContext>

        {localTasks.length ===
          0 && (
            <p
              className={
                styles.emptyText
              }
            >
              No tasks available
            </p>
          )}
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() =>
          setShowModal(false)
        }
        onSave={
          handleSaveTask
        }
        mode={modalMode}
        initialValue={
          initialValue
        }
      />
    </div>
  );
};

export default TaskTable;