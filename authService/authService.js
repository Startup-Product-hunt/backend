const JWT = require("jsonwebtoken");

function createToken(user) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  } catch (error) {
    console.error("Error creating token:", error.message);
    return null;
  }
}

function validateToken(token) {
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Error validating token:", error.message);
    return null;
  }
}

module.exports = {
  createToken,
  validateToken,
};
