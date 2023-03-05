const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllorders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/myorder").get(isAuthenticatedUser, myOrders);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, authRole("admin"), getSingleOrder);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authRole("admin"), getAllorders);

  router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authRole("admin"), updateOrder) 
  .delete(isAuthenticatedUser, authRole("admin"), deleteOrder); 
  

module.exports = router;
