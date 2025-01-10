const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Check if the Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    // Split and validate the Bearer token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Access denied. Token missing." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach decoded payload (user info) to request object
    next();
  } catch (err) {
    // Handle invalid or expired tokens
    res.status(400).json({ msg: "Invalid token." });
  }
};

module.exports = auth;
