const router = require("express").Router();
const carController = require("../controllers/car.controller");
const {
  verifyToken,
  verifyAdmin,
  verifyUser,
} = require("../middleware/auth.middleware");
router.get("/all", verifyToken, verifyUser, carController.getAllcars);
router.get("/add", verifyToken, verifyAdmin, carController.getAddCar);
router.post("/add", verifyToken, verifyAdmin, carController.postAddCar);
router.post("/delete", verifyToken, verifyAdmin, carController.deleteCar);
router.post("/restore", verifyToken, verifyAdmin, carController.restoreCar);
router.get("/edit/:id", verifyToken, verifyAdmin, carController.getEditCar);
router.post("/edit", verifyToken, verifyAdmin, carController.postEditCar);
module.exports = router;
