const crypto = require('crypto');

class Utils {
    generateRandomNumber() {
        const randomNumber = crypto.randomInt(0, 1000000);
        const otp = randomNumber.toString().padStart(6, "0");
        console.log("Generated OTP:", otp);
        return otp;
    }
}

module.exports = new Utils(); // Exporting as a singleton
