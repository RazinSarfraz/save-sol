const bcrypt = require("bcrypt");
const AuthDTO = require("../dtos/authDto");
const jwt = require("jsonwebtoken");
const Utils = require("../utils/utils");
const redisClient = require("../db/redis");
const { redisLoginToken } = require("../models/const");
const { ERRORS } = require("../utils/response");
const userRepository = require("../repository/user");

class UserService {
  async verifyNumber(userData) {
    const { phone } = AuthDTO.VerifyNumber(userData);

    const existingUserPhone = await userRepository.findByPhone(phone);
    if (existingUserPhone) {
      throw new Error(ERRORS.USER_ALREADY_EXISTS);
    }

    const otp = Utils.generateRandomNumber();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const newUser = await userRepository.createUser({ phone, otp: hashedOTP });

    return { id: newUser.id, phone: newUser.phone, otp: otp };
  }

  async verifyOTP(otpData) {
    const { otp, phone } = AuthDTO.VerifyOTP(otpData);

    const user = await userRepository.findByPhone(phone);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) throw new Error(ERRORS.INVALID_OTP);

    await userRepository.updateUser(phone, { is_verified: true, otp: null });
  }

  async resendOTP(otpData) {
    const { phone } = AuthDTO.ResendOTP(otpData);

    const user = await userRepository.findByPhone(phone);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (user.is_verified) throw new Error(ERRORS.USER_ALREADY_REGISTERED);

    const otp = Utils.generateRandomNumber();
    const hashedOTP = await bcrypt.hash(otp, 10);
    await userRepository.updateUser(phone, { otp: hashedOTP });

    return { phone, otp };
  }

  async addUserDetails(otpData) {
    const { name, code, phone } = AuthDTO.UserDetails(otpData);

    const user = await userRepository.findByPhone(phone);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (!user.is_verified) throw new Error(ERRORS.USER_NOT_VERIFIED);
    if (user.is_enabled) throw new Error(ERRORS.USER_ALREADY_REGISTERED);

    const hashedCode = await bcrypt.hash(code, 10);
    await userRepository.updateUser(phone, {
      pinCode: hashedCode,
      name: name,
      is_enabled: true,
    });

    return { name, phone };
  }

  async getUserDetails(data) {
    const { phone } = AuthDTO.getUserDetails(data);

    const user = await userRepository.findByPhone(phone);
    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (!user.is_verified) throw new Error(ERRORS.USER_NOT_VERIFIED);

    return { id: user.id, name: user.name, phone: user.phone };
  }

  async login(loginData) {
    const { phone, code } = AuthDTO.login(loginData);
    const user = await userRepository.findByPhone(phone);

    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (!user.is_verified) throw new Error(ERRORS.USER_NOT_VERIFIED);

    const isCodeValid = await bcrypt.compare(code, user.pinCode);
    if (!isCodeValid) throw new Error(ERRORS.INVALID_PIN_CODE);

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.LOGIN_TOKEN_EXPIRATION_TIME }
    );

    const redisKey = redisLoginToken + token;
    await redisClient.set(phone, redisKey, { EX: 300 });

    return { name: user.name, phone: user.phone, token: token };
  }

  async logout(logoutData) {
    const { phone } = AuthDTO.logout(logoutData);
    const user = await userRepository.findByPhone(phone);

    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);
    if (!user.is_verified) throw new Error(ERRORS.USER_NOT_VERIFIED);

    const storedToken = await redisClient.get(phone);
    if (!storedToken) throw new Error(ERRORS.NOT_LOGGED_IN);

    await redisClient.del(phone);
  }
}

module.exports = new UserService();
