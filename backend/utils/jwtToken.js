//create token and saving


const sendToken = (user, statusCode, res) => {
  const token = user.generateToken();
  const option = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token",token,option).json({
    success:true,
    user,
    token,
  })
};

module.exports = sendToken;