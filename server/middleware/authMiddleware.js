const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // ✅ Get token from Authorization header (standard way)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json("No token provided");
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json("Invalid token");
  }
};

module.exports = verifyToken;