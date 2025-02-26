class AuthDTO {
  static VerifyNumber({ phone }) {
    if (!phone) {
      throw new Error("Phone number is required.");
    }
    return { phone };
  }

  static VerifyOTP({ phone, otp }) {
    if (!phone || !otp) {
      throw new Error("Phone number and OTP are required.");
    }
    return { phone, otp };
  }

  static ResendOTP({ phone }) {
    if (!phone) {
      throw new Error("Phone number is required.");
    }
    return { phone };
  }

  static UserDetails({ name, code,phone }) {
    if (!name || !phone) {
      throw new Error("Name, code and phone are required.");
    }
    if (code.length != 5) {
      throw new Error("code length must be 5.");
    }
    return { name, code, phone };
  }
  static getUserDetails({phone}) {
    if ( !phone) {
      throw new Error("phone is required.");
    }

    return {phone };
  }
  static login({phone,code}) {
    if ( !phone || !code) {
      throw new Error("phone,code is required.");
    }

    return {phone,code};
  }

  static logout({phone}) {
    if ( !phone) {
      throw new Error("phone is required.");
    }

    return {phone};
  }
}

module.exports = AuthDTO;
