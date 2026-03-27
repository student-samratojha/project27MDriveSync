const carModel = require("../db/models/car.model");
const bookingModel = require("../db/models/booking.model");
const userModel = require("../db/models/user.model");
const auditModel = require("../db/models/audit.model");
const { auditingReg } = require("./auth.controller");
async function getMakeBooking(req, res) {
  try {
    const { id } = req.params;
    const car = await carModel.findById(id);
    if (!car) {
      auditingReg(req, "Make Booking Failed-Car Not Found");
      return res.redirect("/secure/user?makeBooking_false");
    }
    res.render("makeBooking", { car, user: req.user });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function postMakeBooking(req, res) {
  try {
    const { id, from, to, address, phone, payment } = req.body;
    const car = await carModel.findById(id);
    if (!car) {
      auditingReg(req, "Make Booking Failed-Car Not Found");
      return res.redirect("/secure/user?makeBooking_false");
    }
    if (car.isBooked || car.isDeleted) {
      auditingReg(req, "Make Booking Failed-Car Not Available");
      return res.redirect("/secure/user?makeBooking_false");
    }
    const booking = new bookingModel({
      user: req.user._id,
      car: id,
      from,
      to,
      price: car.price,
      address,
      phone,
      payment,
    });
    await booking.save();
    car.isBooked = true;
    await car.save();
    auditingReg(req, "Make Booking Success");
    res.redirect("/secure/user?makeBooking_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function cancelBooking(req, res) {
  try {
    const { id } = req.body;
    const booking = await bookingModel.findById(id);
    if (!booking) {
      auditingReg(req, "Cancel Booking Failed-Booking Not Found");
      return res.redirect("/secure/user?cancelBooking_false");
    }
    const car = await carModel.findById(booking.car);
    if (!car) {
      auditingReg(req, "Cancel Booking Failed-Car Not Found");
      return res.redirect("/secure/user?cancelBooking_false");
    }
    if (booking.status !== "pending") {
      auditingReg(req, "Cancel Booking Failed-Booking Not Pending");
      return res.redirect("/secure/user?cancelBooking_false");
    }
    booking.status = "rejected";
    await booking.save();
    car.isBooked = false;
    await car.save();
    auditingReg(req, "Cancel Booking Success");
    res.redirect("/secure/user?cancelBooking_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function approveBooking(req, res) {
  try {
    const { id } = req.body;
    const booking = await bookingModel.findById(id);
    if (!booking) {
      auditingReg(req, "Approve Booking Failed-Booking Not Found");
      return res.redirect("/secure/admin?approveBooking_false");
    }
    if (booking.status !== "pending") {
      auditingReg(req, "Approve Booking Failed-Booking Not Pending");
      return res.redirect("/secure/admin?approveBooking_false");
    }
    booking.status = "approved";
    await booking.save();
    auditingReg(req, "Approve Booking Success");
    res.redirect("/secure/admin?approveBooking_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function rejectBooking(req, res) {
  try {
    const { id } = req.body;
    const booking = await bookingModel.findById(id);
    const car = await carModel.findById(booking.car);
    if (!booking) {
      auditingReg(req, "Reject Booking Failed-Booking Not Found");
      return res.redirect("/secure/admin?rejectBooking_false");
    }
    if (!car) {
      auditingReg(req, "Reject Booking Failed-Car Not Found");
      return res.redirect("/secure/admin?rejectBooking_false");
    }
    if (booking.status !== "pending") {
      auditingReg(req, "Reject Booking Failed-Booking Not Pending");
      return res.redirect("/secure/admin?rejectBooking_false");
    }
    booking.status = "rejected";
    await booking.save();

    car.isBooked = false;
    await car.save();
    auditingReg(req, "Reject Booking Success");
    res.redirect("/secure/admin?rejectBooking_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

module.exports = {
  getMakeBooking,
  postMakeBooking,
  cancelBooking,
  approveBooking,
  rejectBooking,
};
