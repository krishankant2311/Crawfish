require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../module/admin/model/adminModel");

const verifyJWT = async (req, res, next) => {
  try {
    const incomingToken = req.headers.token;
    if (!incomingToken) {
      return res.send({
        statusCode: 400,
        succes: false,
        message: "Token not Found",
        result: {},
      });
    }

    const decodeToken = await jwt.verify(incomingToken, process.env.JWT_SECRET_KEY);
    if (!decodeToken) {
      return res.send({
        statusCode: 400,
        succes: false,
        message: "invalid Token",
        result: {},
      });
    }
    
    req.token = decodeToken;
    return next();
  } catch (error) {
    console.error(error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " EEROR in verify JWT",
      result: {},
    });
  }
};

const generateJWT = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "30days",
  });
  if (!token) {
    return false;
  } else {
    return token;
  }
};

module.exports = { generateJWT, verifyJWT };
