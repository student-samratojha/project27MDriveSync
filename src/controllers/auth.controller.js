const userModel = require("../db/models/user.model");
const auditModel = require("../db/models/audit.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { stripTypeScriptTypes } = require("node:module");
async function auditingReg(req, action) {
  try {
    const audit = new auditModel({
      user: req.user?._id || null,
      action: action,
      route: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    await audit.save();
  } catch (err) {
    console.log(err);
  }
}

async function getRegister(req, res) {
  try {
    res.render("register");
  } catch (err) {
    console.log(err);
  }
}

async function postRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      auditingReg(req, "Register Failed-User Already Exist");
      return res.status(400).json({ message: "User Already Exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    auditingReg(req, "Register Success");
    res.redirect("/auth/login?Register_true");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getLogin(req, res) {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      auditingReg(req, "Login Failed-User Not Found");
      return res.status(400).json({ message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      auditingReg(req, "Login Failed-Password Not Match");
      return res.status(400).json({ message: "Password Not Match" });
    }
    if (user.isDeleted) {
      auditingReg(req, "Login Failed-User Deleted");
      return res.status(400).json({ message: "User Deleted" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    await auditingReg(req, "Login Success");
    res.redirect(`/secure/${user.role}?welcome_Sir`);
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token");
    auditingReg(req, "Logout Success");
    res.redirect("/auth/login?logout_true");
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  auditingReg,
  logout,
};
