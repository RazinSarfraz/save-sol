const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const verifyLoginToken = require("../middleware/auth");

router.post("/verify/number", authController.verifyNumber);
router.post("/verify/otp", authController.verifyRegisterOTP);
router.post("/verify/resendotp", authController.resendRegisterOTP);
router.post("/user/details", authController.addUserDetails);
router.get("/user/details/:phone", verifyLoginToken,authController.getUserDetails);
router.post("/user/login", authController.login);
router.post("/user/logout", verifyLoginToken,authController.logout);



module.exports = router;
