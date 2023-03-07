const express = require("express");
const errMiddleware = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const app = express();
app.use(express.json());
app.use(cookieParser())
const cors = require("cors")

app.use(
    cors({
        origin: "*"
    })
)
//routes import
const product = require("./routes/productRoutes");
const user = require("./routes/UserRoutes");
const order = require("./routes/orderRoute");


app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);


app.use(errMiddleware)

module.exports = app;
