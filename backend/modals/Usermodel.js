const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
        require: true,
      },
      url: {
        type: String,
        require: true,
      },
    },

    UserType: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExp: Date,
  },
  { timestamps: true }
);

//bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
//password match password
userSchema.methods.comparePassword = async function (enterdPasswod) {
  return await bcrypt.compare(enterdPasswod, this.password);
};

//JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.Jwt_CODE, { expiresIn: "3d" });
};
//hashing and reset password
userSchema.methods.getResetPasswordToken = function () {
  //gen token
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExp = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("user", userSchema);
