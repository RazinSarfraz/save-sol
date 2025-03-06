const jwt = require("jsonwebtoken");
const redisClient = require("../db/redis");
const { redisLoginToken } = require("../models/const");
const userRepository = require("../repository/user");
const { ERRORS } = require("../utils/response");

const verifyLoginToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Token required" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await userRepository.findByPhone(req.user.phone);
    if (!user) {
      return res.status(401).json({ error: ERRORS.USER_NOT_FOUND });
    }

    // Check token in Redis
    const redisKey = redisLoginToken + token;
    const storedToken = await redisClient.get(req.user.phone);

    if (!storedToken || storedToken !== redisKey) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.context = { user };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = verifyLoginToken;
