const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isAuth = async (req, res, next) => {
  let token = "";

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    if (!token) {
      return res.status(401).send({ error: "Unauthorized access!" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await fetch(
      `http://localhost:3003/get?userId=${decode.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!user.status === 200) {
      return res.status(401).send({ error: "Unauthorized access!" });
    }

    const userInfo = await user.json();
    userInfo._id = userInfo._id;

    req.user = userInfo;
  } catch (error) {
    console.log("ERROR : " + error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ error: "Unauthorized access!" });
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .send({ error: "Token expired, try signing in again!" });
    }

    return res.status(500).send({ error: "Internal server error!" });
  }
  return next();
};
