const mongoose = require("mongoose");
const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
      modelYear: {
      type: String,
      required: true,
    },
    seat: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    coc: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["luxary", "ordinary"],
      default: "ordinary",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Car", carSchema);
