const {ValidateSignature} = require("../utils");

exports.isAuth = async (req, res, next) => {
  let token = "";

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
console .log("Auth token",token)
  try {
    if (!token) {
      return res.status(401).send({ error: "Unauthorized access!" });
    }

    const isValidToken = await ValidateSignature(req);
   
    if (!isValidToken) {
      return res.status(401).send({ error: "Unauthorized access!" });
    }
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
