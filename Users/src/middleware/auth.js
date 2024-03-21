const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

exports.isAuth = async (req, res, next) => {
  let token = "";

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    if (!token) {
      return res.status(401).send({ error: "Unauthorized access!" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decode.userId).select("-password -phone").lean();

    if (!user) {
      return res.status(401).send({ error: "Unauthorized access!" });
    }

    user._id = user._id.toString();

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ error: "Unauthorized access!" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(403).send({ error: "Token expired, try signing in again!" });
    }

    return res.status(500).send({ error: "Internal server error!" });
  }
};
