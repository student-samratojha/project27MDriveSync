const mongoose = require("mongoose");
const auditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    route: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Audit", auditSchema);
