const bcrypt = require("bcrypt");
const AuthDTO = require("../dtos/authDto");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const Utils = require("../utils/utils");
const redisClient = require("../db/redis");
const { redisLoginToken } = require("../models/const");

class UserService {
  async verifyNumber(userData) {
    const { phone } = AuthDTO.VerifyNumber(userData);

    const existingUserPhone = await User.findOne({ where: { phone } });
    if (existingUserPhone) {
      throw new Error("User with this phone already exists.");
    }

    // Hash password before saving

    const otp = Utils.generateRandomNumber();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const newUser = await User.create({
      phone,
      otp: hashedOTP,
    });

    return {
      id: newUser.id,
      phone: newUser.phone,
      otp: otp,
    };
  }

  async verifyOTP(otpData) {
    const { otp, phone } = AuthDTO.VerifyOTP(otpData);

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      throw new Error("Invalid OTP.");
    }

    user.is_verified = true;
    user.otp = null;
    await user.save();

    return { message: "User verified successfully." };
  }

  async resendOTP(otpData) {
    const { phone } = AuthDTO.ResendOTP(otpData);

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.is_verified) {
      throw new Error("User already verified.");
    }

    const otp = Utils.generateRandomNumber();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await user.update({ otp: hashedOTP });

    return { phone, otp };
  }

  async addUserDetails(otpData) {
    const { name, code, phone } = AuthDTO.UserDetails(otpData);

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.is_verified) {
      throw new Error("User not verified.");
    }

    if (user.is_enabled) {
      throw new Error("User already registered.");
    }

    const hashedCode = await bcrypt.hash(code, 10);

    await user.update({ pinCode: hashedCode, name: name, is_enabled: true });

    return {
      message: "User registered successfully",
      name: user.name,
      phone: user.phone,
    };
  }
  async getUserDetails(data) {
    const { phone } = AuthDTO.getUserDetails(data);

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.is_verified) {
      throw new Error("User not verified.");
    }
    return {
      message: "User Data Fetched successfully",
      id: user.id,
      name: user.name,
      phone: user.phone,
    };
  }
  async login(loginData) {
    const { phone, code } = AuthDTO.login(loginData); // Assuming this extracts phone and code from loginData
    const user = await User.findOne({ where: { phone: phone } });

    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.is_verified) {
      throw new Error("User not verified.");
    }

    // Compare the provided code with the hashed code stored in the database
    const isCodeValid = await bcrypt.compare(code, user.pinCode);

    if (!isCodeValid) {
      throw new Error("Invalid pin code.");
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );
    const redisKey = redisLoginToken + token;

    await redisClient.set(phone, redisKey, { EX: 300 });

    return {
      message: "Login successfully",
      name: user.name,
      phone: user.phone,
      token: token,
    };
  }

  async logout(logoutData) {
    const { phone } = AuthDTO.logout(logoutData); // Assuming this extracts phone and code from loginData
    const user = await User.findOne({ where: { phone: phone } });

    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.is_verified) {
      throw new Error("User not verified.");
    }

    // Check if the user exists in Redis
    const storedToken = await redisClient.get(phone);

    if (!storedToken) {
      throw new Error("User is not logged in or already logged out.");
    }

    // Remove token from Redis
    await redisClient.del(phone);

    return { message: "Logout successful" };
  }
}

module.exports = new UserService();
