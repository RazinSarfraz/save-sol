const authService = require("../services/auth");
const authDTO = require("../dtos/authDto");
const { RESPONSE_MESSAGES, RESULT_CODES } = require("../utils/response");

class AuthController {
  constructor() {
    this.verifyNumber = this.verifyNumber.bind(this);
    this.verifyRegisterOTP = this.verifyRegisterOTP.bind(this);
    this.resendRegisterOTP = this.resendRegisterOTP.bind(this);
    this.addUserDetails = this.addUserDetails.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  formatResponse = (resultCode, message, data = {}) => ({
    resultCode,
    message,
    data,
  });

  async verifyNumber(req, res) {
    try {
      const userDate = authDTO.VerifyNumber(req.body);
      const user = await authService.verifyNumber(userDate);
      return res
        .status(201)
        .json(
          this.formatResponse(
            RESULT_CODES.SUCCESS,
            RESPONSE_MESSAGES.VERIFY_NUMBER_SUCCESS,
            user
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(this.formatResponse(RESULT_CODES.ERROR, error.message));
    }
  }

  async verifyRegisterOTP(req, res) {
    try {
      const otpData = authDTO.VerifyOTP(req.body);
      const result = await authService.verifyOTP(otpData);
      return res
        .status(201)
        .json(
          this.formatResponse(
            RESULT_CODES.SUCCESS,
            RESPONSE_MESSAGES.VERIFY_OTP_SUCCESS,
            result
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(this.formatResponse(RESULT_CODES.ERROR, error.message));
    }
  }

  async resendRegisterOTP(req, res) {
    try {
      const otpData = authDTO.ResendOTP(req.body);
      const result = await authService.resendOTP(otpData);
      return res
        .status(201)
        .json(
          this.formatResponse(
            RESULT_CODES.SUCCESS,
            RESPONSE_MESSAGES.RESEND_OTP_SUCCESS,
            result
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(this.formatResponse(RESULT_CODES.ERROR, error.message));
    }
  }

  async addUserDetails(req, res) {
    try {
      const userData = authDTO.UserDetails(req.body);
      const result = await authService.addUserDetails(userData);
      return res
        .status(201)
        .json(
          this.formatResponse(
            RESULT_CODES.SUCCESS,
            RESPONSE_MESSAGES.USER_REGISTER_SUCCESS,
            result
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(this.formatResponse(RESULT_CODES.ERROR, error.message));
    }
  }

  async getUserDetails(req, res) {
    try {
      const phone = req.user.phone;
      const userData = authDTO.getUserDetails({phone});
      const result = await authService.getUserDetails(userData);
      return res
        .status(201)
        .json(
          this.formatResponse(
            RESULT_CODES.SUCCESS,
            RESPONSE_MESSAGES.GET_USER_DETAILS_SUCCESS,
            result
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(this.formatResponse(RESULT_CODES.ERROR, error.message));
    }
  }

  async login(req, res) {
    try {
      const loginData = authDTO.login(req.body);
      const result = await authService.login(loginData);
      return res
        .status(201)
        .json(
          this.formatResponse(
            RESULT_CODES.SUCCESS,
            RESPONSE_MESSAGES.LOGIN_SUCCESS,
            result
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(this.formatResponse(RESULT_CODES.ERROR, error.message));
    }
  }

  async logout(req, res) {
    try {
      const phone = req.user.phone;
      const logoutData = authDTO.logout({phone});
      const result = await authService.logout(logoutData);
      return res
        .status(201)
        .json(
          this.formatResponse(
            RESULT_CODES.SUCCESS,
            RESPONSE_MESSAGES.LOGOUT_SUCCESS,
            result
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(this.formatResponse(RESULT_CODES.ERROR, error.message));
    }
  }
}

module.exports = new AuthController();
