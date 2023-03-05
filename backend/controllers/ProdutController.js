const errorHandler = require("../utils/ErrorHandler");
const getCatch = require("../middleware/getCatch");
const products = require("../modals/Productmodal");
const ApiFeatuers = require("../utils/apifeature")
//Create product Api ---only admin
exports.createProduct = getCatch(async (req, res, next) => {
  req.body.user = req.User.id;
  const product = await products.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Get all product Api

exports.getAllProducts = async (req, res, next) => {
  const apifeatures= new ApiFeatuers(products.find(),req.query).search();
    const allProducts = await apifeatures.query;


  res.status(200).json({
    success: true,
    allProducts,
  });
};

// update product -- admin
exports.updateProduct = getCatch(async (req, res, next) => {
  let product = await products.findById(req.params.id);
  if (!product) {
    return next(new errorHandler("product not Found", 404));
  }
  product = await products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// delete product -- admin
exports.deleteProduct = async (req, res, next) => {
  const product = await products.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: true,
      message: "sfdsdfsdfs",
    });
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "product delete successfully",
  });
};
exports.getSingleProduct = async (req, res, next) => {
  const product = await products.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "producy not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
};
//create review and delete review
exports.createProductReview = getCatch(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await products.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  products.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  products.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
