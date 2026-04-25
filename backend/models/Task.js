import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    weekKey: {
      type: String,
      required: true
    },

    days: {
      type: [String],
      enum: ["empty", "done", "miss"],
      default: Array(7).fill("empty")
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Task", taskSchema);