const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUsers,
  deleteUser,
  userUpdate,
  Logout,
  ForgetPassword,
  resetPassword,
  userProfile,
  updatePassword,
  updateProfile,
  getAlluser1,
  getSingleUser,
  updateUserType,
} = require("../controllers/UserController");
const { isAuthenticatedUser, authRole } = require("../middleware/auth");
const router = express.Router();

//user resgister api
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(Logout);
router.route("/changepassword").put(isAuthenticatedUser, updatePassword);
router.route("/updateProfile").put(isAuthenticatedUser, updateProfile);
router.route("/forgot").post(ForgetPassword);
router.route("/alluser").get(getAlluser1);
router.route("/profile").get(isAuthenticatedUser, userProfile);
router.route("/reset/:token").put(resetPassword);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authRole("admin"), getSingleUser)
  .put(updateUserType)
  .delete(deleteUser);
// router.route("/singleuser/:_id").get(getSingleUsers)
// router.route("/deleteuser/:_id").delete(deleteUser)
// router.route("/updateuser/:_id").put(userUpdate)

module.exports = router;
