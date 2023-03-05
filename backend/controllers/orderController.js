const Order = require("../modals/orderModel");
const errorHandler = require("../utils/ErrorHandler");
const getCatch = require("../middleware/getCatch");
const products = require("../modals/Productmodal");

exports.newOrder = getCatch(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.User.id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});
//get Sinngle User

exports.getSingleOrder = getCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "User",
    "firstName email"
  );
  if (!order) {
    return next(new errorHandler("Order not found With this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});
// get logged un user order
exports.myOrders = getCatch(async (req, res, next) => {
  const orders = await Order.find({ user: req.User.id });

  res.status(200).json({
    success: true,
    orders,
  });
});
//get all order --admin
exports.getAllorders = getCatch(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
//update order --admin
exports.updateOrder = getCatch(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
   
   if(order.orderStatus === "Delivered" ){
    return next(new errorHandler("you have already delivered this order",400))

   }
   order.orderItems.forEach(async(ord)=>{
    await updateStock(ord.product,ord.quantity)
   })
   order.orderStatus = req.body.status;
   if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
   }
   await order.save({validateBeforeSave:false})
    res.status(200).json({
      success: true,
    
    });
  });

  async function updateStock(id,quantity){
    const product = await products.findById(id)

    products.Stock -= quantity;

    await product.save({ validateBeforeSave:false})
  }
//delete order
  exports.deleteOrder = getCatch(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new errorHandler("Order not found With this id", 404));
      }
      await order.remove()
    res.status(200).json({
      success: true,
     
    });
  });