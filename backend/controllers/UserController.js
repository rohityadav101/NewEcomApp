const errorHandler = require("../utils/ErrorHandler");
const getCatch = require("../middleware/getCatch");
const User = require("../modals/Usermodel");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//registerUser
exports.createUser = getCatch(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber, UserType } =
    req.body;
  const existUser = await User.findOne({ email });
  if (!existUser) {
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      UserType,
      avatar: {
        public_id: "asdasdas",
        url: "asdfasfas",
      },
    });
    sendToken(user, 201, res);
  } else {
    res.status(401).json({
      message: "user already exist",
    });
  }
});
//loginUser
exports.loginUser = getCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    sendToken(user, 201, res);
    // const token = user.generateToken();
    // res.json({
    //   success: true,
    //   user,
    //   token,
    // });
  } else {
    res.status(400).json({
      message: "invalid credential",
    });
  }
});

//logOut
exports.Logout = getCatch(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logOut",
  });
});
// forgetPassword
exports.ForgetPassword = getCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not found", 404));
  }
  //getReset
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset/${resetToken}`;
  const message = `your password :- \n\n ${resetPasswordUrl} \n \n if you have not request this email then , please ignore it  `;

  try {
    await sendEmail({
      email: user.email,
      subject: `ecom password recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExp = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new errorHandler(error.message, 500));
  }
});
//reset password

exports.resetPassword = getCatch(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExp: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("invalid user or has been expire ", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password not mactch ", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExp = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//get profile details

exports.userProfile = getCatch(async (req, res, next) => {
  const user = await User.findById(req.User.id);

  res.json({
    success: true,
    user,
  });
});
//upadte password
exports.updatePassword = getCatch(async (req, res, next) => {
  
  const user = await User.findById(req.User.id);
  console.log(user)
  const isPasswordMatched1 = await user.comparePassword(req.body.oldPassword);
console.log(isPasswordMatched1)
  
  if (!isPasswordMatched1) {
    return next(new errorHandler("old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new errorHandler("password does not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
//updateprofile
exports.updateProfile = getCatch(async (req, res, next) => {
  const newUserData = {
    firstName: req.body.firstName,
    email: req.body.email,
  };
  
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
//get all user(admin)
exports.getAlluser1 = getCatch(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//get single user(admin)
exports.getSingleUser = getCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`)
    )
  }
  res.status(200).json({
    success: true,
    user,
  });
});
//update role
exports.updateUserType = getCatch(async (req, res, next) => {
  const newUserData = {
    email: req.body.email,
    UserType: req.body.UserType,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// delete user
exports.deleteUser = getCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`)
    )
  }
  await user.remove()
  res.status(200).json({
    success: true,
    user,
  });
});