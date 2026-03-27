const router = require("express").Router();
const { verifyAdmin } = require("../middleware/auth.middleware");
const bookingController = require("../controllers/booking.controller");
const { verifyToken, verifyUser } = require("../middleware/auth.middleware");
router.get(
  "/make/:id",
  verifyToken,
  verifyUser,
  bookingController.getMakeBooking,
);
router.post(
  "/make",
  verifyToken,
  verifyUser,
  bookingController.postMakeBooking,
);
router.post(
  "/cancel",
  verifyToken,
  verifyUser,
  bookingController.cancelBooking,
);
router.post(
  "/approve",
  verifyToken,
  verifyAdmin,
  bookingController.approveBooking,
);
router.post(
  "/reject",
  verifyToken,
  verifyAdmin,
  bookingController.rejectBooking,
);
module.exports = router;
