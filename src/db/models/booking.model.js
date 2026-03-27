const mongoose = require("mongoose");
const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Booking", bookingSchema);
