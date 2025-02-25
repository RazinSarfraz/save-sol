const bcrypt = require("bcrypt");
const AuthDTO = require("../dtos/authDto");
const { User } = require("../models");
const Utils = require("../utils/utils");

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
}

module.exports = new UserService();
