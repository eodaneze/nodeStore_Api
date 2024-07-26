const express = require('express');
const dotenv = require('dotenv');
require('colors');
require('./config/mongo_connect')
dotenv.config();

const authRouter = require('./route/auth.route')
const userRouter = require('./route/user.route')
const productRouter = require('./route/product.route')
const cartRouter = require('./route/cart.route')
const paymentRouter = require('./route/payment.route')
const app = express();

app.use(express.json());


app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", paymentRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`.blue);
})