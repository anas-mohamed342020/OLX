const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const jwt = require("jsonwebtoken");
const { userModel } = require("../DB/models/user.model");

const roles = {
  user: "user",
  admin: "admin",
};
Object.freeze(roles);

const auth = (roles) => {
  return async (req, res, next) => {
    const tokenHeader = req.headers.authorization;

    if (tokenHeader && tokenHeader.startsWith(process.env.tokenStart)) {
      const token = tokenHeader.split(" ")[1];
      const tokenV = jwt.verify(token, process.env.tokenKey);
      const userData = await userModel.findById(tokenV._id);
      if (userData) {
        if (userData.isDeleted) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "this user id deleted",
            status: ReasonPhrases.FORBIDDEN,
          });
        } else {
          if (userData.online) {
            if (roles) {
              if (roles.includes(userData.role)) {
                req.user = userData;
                next();
              } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                  message: "you are not authraized",
                  status: ReasonPhrases.BAD_REQUEST,
                });
              }
            } else {
              req.user = userData;
              next();
            }
          } else {
            res.status(StatusCodes.BAD_REQUEST).json({message:"this user is logged out",status:ReasonPhrases.BAD_REQUEST})
          }
        }
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "user not found auth",
          status: ReasonPhrases.NOT_FOUND,
        });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "in-valid token",
        status: ReasonPhrases.BAD_REQUEST,
      });
    }
  };
};

module.exports = { auth, roles };
