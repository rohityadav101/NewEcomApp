const getCatch = require("./getCatch");
const jwt = require("jsonwebtoken");
const User = require("../modals/Usermodel");
const ErrorHandler = require("../utils/ErrorHandler");
exports.isAuthenticatedUser = getCatch(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log("sdfsdfsdfsdf", token);
  if (!token) {
    return next(new ErrorHandler("please login to accsess token", 401));
  }
  const decodedata = jwt.verify(token, process.env.Jwt_CODE);
  req.User = await User.findById(decodedata.id);
  next();
});

exports.authRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.User.UserType)) {
      return next(
        new ErrorHandler(`${req.User.UserType} is not accessable `, 403)
      );
    }
    next();
  };
};
 