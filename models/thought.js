const mongoose = require("mongoose");
const { Schema } = mongoose;

const thoughtSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sheetId: {
    type: Schema.Types.ObjectId,
    ref: "Sheet",
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thoughtitem",
    },
  ],
  type: {
    type: String,
    enum: ["today", "tomorrow", "work", "art"],
  },
  startTime: String,
  endTime: String,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Thought", thoughtSchema);
