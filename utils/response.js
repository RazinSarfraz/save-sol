const RESPONSE_MESSAGES = {
  VERIFY_NUMBER_SUCCESS: "Verification initiated",
  VERIFY_OTP_SUCCESS: "OTP verified successfully",
  RESEND_OTP_SUCCESS: "OTP resent successfully",
  USER_REGISTER_SUCCESS: "User registered successfully",
  GET_USER_DETAILS_SUCCESS: "User details fetched successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  ERROR: "An error occurred",
};

const RESULT_CODES = {
  SUCCESS: 200,
  ERROR: 400,
};

const ERRORS = {
  USER_ALREADY_EXISTS: "User with this phone already exists.",
  VERIFICATION_INITIATED: "Verification initiated",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_RESENT: "OTP resent successfully",
  USER_REGISTERED: "User registered successfully",
  USER_DETAILS_FETCHED: "User details fetched successfully",
  LOGIN_SUCCESSFUL: "Login successful",
  LOGOUT_SUCCESSFUL: "Logout successful",
  USER_NOT_FOUND: "User not found.",
  USER_NOT_VERIFIED: "User not verified.",
  USER_ALREADY_REGISTERED: "User already registered.",
  INVALID_OTP: "Invalid OTP.",
  INVALID_PIN_CODE: "Invalid pin code.",
  NOT_LOGGED_IN: "User is not logged in or already logged out.",
};

module.exports = { RESPONSE_MESSAGES, RESULT_CODES, ERRORS };
