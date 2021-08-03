const mongoose = require("mongoose");
const { Schema } = mongoose;

const daySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  day: String,
  awake: String,
  asleep: String,
  gratefulFor: String,
  affirmation: String,
  callSos: String,
  research: String,
  reading: {
    title: String,
    start: Number,
    end: Number,
  },
  accountability: {
    done: String,
    todo: String,
  },
  todos: {
    today: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
    tomorrow: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
    work: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
    art: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
  },
  createdAt: Date,
});

module.exports = mongoose.model("Sheet", daySchema);
