const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    console.log("🔐 Incoming token:", token); // ✅ Log the raw token

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded token:", decoded); // ✅ Show payload

      const user = await User.findById(decoded.id).select("-password");
      console.log("👤 Found user:", user); // ✅ Show user fetched from DB

      req.user = user;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } else {
      console.warn("⛔ No or malformed token");
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

module.exports = { protect };









