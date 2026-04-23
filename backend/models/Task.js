import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  weekKey: {
    type: String,
    required: true
  },

  days: {
    type: [String],
    enum: ["done", "miss", "empty"],
    default: ["empty", "empty", "empty", "empty", "empty", "empty", "empty"]
  }

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);