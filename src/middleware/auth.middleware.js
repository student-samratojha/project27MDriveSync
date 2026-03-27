const jwt = require("jsonwebtoken");
const userModel = require("../db/models/user.model");
async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/auth/login?token_false");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      res.clearCookie("token");
      return res.redirect("/auth/login?user_false");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.clearCookie("token");
    return res.redirect("/auth/login?token_false");
  }
}

async function verifyAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.redirect("/auth/login?admin_false");
    }
  } catch (err) {
    console.log(err);
    res.clearCookie("token");
    return res.redirect("/auth/login?token_false");
  }
}

async function verifyUser(req, res, next) {
  try {
    if (req.user && req.user.role === "user") {
      next();
    } else {
      return res.redirect("/auth/login?user_false");
    }
  } catch (err) {
    console.log(err);
    res.clearCookie("token");
    return res.redirect("/auth/login?token_false");
  }
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser,
};