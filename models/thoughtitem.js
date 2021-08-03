const mongoose = require("mongoose");
const { Schema } = mongoose;

const thoughtItemSchema = new Schema({
  thoughtId: {
    type: Schema.Types.ObjectId,
    ref: "Thought",
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

module.exports = mongoose.model("ThoughtItem", thoughtItemSchema);
