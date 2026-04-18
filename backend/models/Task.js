import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "pending"
  },
  priority: String,
  category: String,
  weekKey: String
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);