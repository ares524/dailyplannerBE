const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoItemSchema = new Schema({
  todoId: {
    type: Schema.Types.ObjectId,
    ref: "Todo",
  },
  title: String,
  actions: [
    {
      text: String,
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("TodoItem", todoItemSchema);
