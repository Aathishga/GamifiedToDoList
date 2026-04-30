const jwt = require("jsonwebtoken");

const SECRET = "secret123"; // Must match the one in authController.js

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Expected token format: "Bearer <token>"
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET);
    req.user = decoded; // Contains id from jwt.sign({ id: user._id })
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
