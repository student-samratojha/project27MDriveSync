const router = require("express").Router();
const secureController = require("../controllers/secure.controller");
const {
  verifyToken,
  verifyAdmin,
  verifyUser,
} = require("../middleware/auth.middleware");
router.get("/admin", verifyToken, verifyAdmin, secureController.getAdminPage);
router.post("/delete", verifyToken, verifyAdmin, secureController.deleteUser);
router.post("/restore", verifyToken, verifyAdmin, secureController.restoreUser);
router.get("/user", verifyToken, verifyUser, secureController.getUserPage);
module.exports = router;