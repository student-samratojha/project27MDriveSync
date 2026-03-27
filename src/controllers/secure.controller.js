const auditModel = require("../db/models/audit.model");
const userModel = require("../db/models/user.model");
const bookingModel = require("../db/models/booking.model");
const carModel = require("../db/models/car.model");
const { auditingReg } = require("./auth.controller");
async function getAdminPage(req, res) {
  try {
    const users = await userModel.find({ role: "user" });
    const audits = await auditModel
      .find()
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("user");
    const bookings = await bookingModel.find().populate("car").populate("user");
    const cars = await carModel.find();
    res.render("admin", {
      users,
      audits,
      bookings,
      cars,
      admin: req.user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      auditingReg(req, "Delete User Failed-User Not Found");
      return res.status(404).send("User not found");
    }
    user.isDeleted = true;
    await user.save();
    auditingReg(req, "Delete User Success");
    res.redirect("/secure/admin?delete_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function restoreUser(req, res) {
  try {
    const { id } = req.body;
    const user = await userModel.findById(id);
    if (!user) {
      await auditingReg(req, "Restore User Failed-User Not Found");
      return res.status(404).send("User not found");
    }
    user.isDeleted = false;
    await user.save();
    auditingReg(req, "Restore User Success");
    res.redirect("/secure/admin?restore_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function getUserPage(req, res) {
  try {
    const bookings = await bookingModel
      .find({ user: req.user._id })
      .populate("car");
    res.render("user", { user: req.user, bookings });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

module.exports = {
  getAdminPage,
  deleteUser,
  restoreUser,
  getUserPage,
};
