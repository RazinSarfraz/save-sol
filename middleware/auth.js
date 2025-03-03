const jwt = require("jsonwebtoken");
const redisClient = require("../db/redis");
const { redisLoginToken } = require("../models/const");

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

    // Extract phone number from path variable
    const { phone } = req.params;

    // Ensure the token belongs to the correct user
    if (!phone || phone !== req.user.phone) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    
    // Check token in Redis
    const redisKey = redisLoginToken + token;
    const storedToken = await redisClient.get(req.user.phone);

    if (!storedToken || storedToken !== redisKey) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = verifyLoginToken;