const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodItemSchema = new Schema({
  foodId: {
    type: Schema.Types.ObjectId,
    ref: "Food",
  },
  foodCategory: String,
  description: String,
  actions: [
    {
      nutrientName: String,
      unitName: String,
      value: Number,
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

module.exports = mongoose.model("FoodItem", foodItemSchema);
