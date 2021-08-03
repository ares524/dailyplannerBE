const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // foodNutrients: [
  //   {
  //     derivationDescription: String,
  //     nutrientName: String,
  //     unitName: String,
  //     value: Number,
  //   },
  // ],
  type: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
  },
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  foodCategory: String,
  description: String,
  foodNutrients: Array,
  completed: Boolean,
  startTime: String,
  endTime: String,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Food", foodSchema);
