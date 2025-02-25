const authService = require("../services/auth");
const authDTO = require("../dtos/authDto");

class AuthController {
  async verifyNumber(req, res) {
    try {
      const userDate = authDTO.VerifyNumber(req.body);
      const user = await authService.verifyNumber(userDate);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  
  async verifyRegisterOTP(req, res) {
    try {
      const otpData = authDTO.VerifyOTP(req.body);
      const result = await authService.verifyOTP(otpData);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async resendRegisterOTP(req, res) {
    try {
      const otpData = authDTO.ResendOTP(req.body);
      const result = await authService.resendOTP(otpData);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async addUserDetails(req, res) {
    try {
      const userData = authDTO.UserDetails(req.body);
      const result = await authService.addUserDetails(userData);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
