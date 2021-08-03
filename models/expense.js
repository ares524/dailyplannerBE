const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  description: String,
  type: {
    type: String,
    enum: ["life", "business"],
  },
  createdAt: Date,
});

module.exports = mongoose.model("Expense", expenseSchema);
