const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/verify/number", authController.verifyNumber);
router.post("/verify/otp", authController.verifyRegisterOTP);
router.post("/verify/resendotp", authController.resendRegisterOTP);
router.post("/user/details", authController.addUserDetails);
router.get("/user/details/:phone", authController.getUserDetails);
router.post("/user/login", authController.login);



module.exports = router;
