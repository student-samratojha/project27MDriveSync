const userModel = require("../db/models/user.model");
const auditModel = require("../db/models/audit.model");
const carModel = require("../db/models/car.model");
const bookingModel = require("../db/models/booking.model");
const { auditingReg } = require("./auth.controller");
async function getAddCar(req, res) {
  try {
    res.render("addCar", { admin: req.user });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function postAddCar(req, res) {
  try {
    const { name, model, modelYear, seat, price, image, type } = req.body;

    // Unique COC Generate
    const cocN =
      name.trim().toUpperCase() +
      model.trim().toUpperCase() +
      modelYear +
      Date.now().toString().slice(-4);

    // Existing car check
    const existingCar = await carModel.findOne({
      name: name.trim(),
      model: model.trim(),
      modelYear: modelYear.trim(),
    });

    if (existingCar) {
      auditingReg(req, "Add Car Failed - Car Already Exists");
      return res.redirect("/secure/admin?addCar_false");
    }

    // Create new car
    const newCar = new carModel({
      name: name.trim(),
      model: model.trim(),
      modelYear: modelYear.trim(),
      seat: Number(seat),
      price: Number(price),
      image: image.trim(),
      type,
      coc: cocN,
    });

    await newCar.save();

    auditingReg(req, "Add Car Success");

    return res.redirect("/secure/admin?addCar_true");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = { postAddCar };

async function deleteCar(req, res) {
  try {
    const { id } = req.body;
    const car = await carModel.findById(id);
    if (!car) {
      auditingReg(req, "Delete Car Failed-Car Not Found");
      return res.redirect("/secure/admin?deleteCar_false");
    }
    if (car.isBooked) {
      await auditingReg(req, "Delete Car Failed-Car Have Active Booking");
      return res.redirect("/secure/admin?deleteCar_false");
    }
    car.isDeleted = true;
    await car.save();
    auditingReg(req, "Delete Car Success");
    res.redirect("/secure/admin?deleteCar_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function restoreCar(req, res) {
  try {
    const { id } = req.body;
    const car = await carModel.findById(id);
    if (!car) {
      await auditingReg(req, "Restore Car Failed-Car Not Found");
      return res.redirect("/secure/admin?restoreCar_false");
    }
    car.isDeleted = false;
    await car.save();
    auditingReg(req, "Restore Car Success");
    res.redirect("/secure/admin?restoreCar_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function getEditCar(req, res) {
  try {
    const { id } = req.params;
    const car = await carModel.findById(id);
    if (!car) {
      auditingReg(req, "Edit Car Failed-Car Not Found");
      return res.redirect("/secure/admin?editCar_false");
    }
    res.render("editCar", { car, admin: req.user });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function postEditCar(req, res) {
  try {
    const { id, name, modelYear, model, seat, price, image, type } = req.body;
    const car = await carModel.findById(id);
    if (!car) {
      auditingReg(req, "Edit Car Failed-Car Not Found");
      return res.redirect("/secure/admin?editCar_false");
    }
    car.name = name || car.name;
    car.modelYear = modelYear || car.modelYear;
    car.model = model || car.model;
    car.seat = seat || car.seat;
    car.price = price || car.price;
    car.image = image || car.image;
    car.type = type || car.type;
    await car.save();
    auditingReg(req, "Edit Car Success");
    res.redirect("/secure/admin?editCar_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function getAllcars(req, res) {
  try {
    const cars = await carModel.find();
    res.render("allcars", { cars });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}
module.exports = {
  getAddCar,
  postAddCar,
  deleteCar,
  getAllcars,
  restoreCar,
  getEditCar,
  postEditCar,
};
