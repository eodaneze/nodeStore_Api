const express = require('express');
const dotenv = require('dotenv');
require('colors');
require('./config/mongo_connect')
dotenv.config();

const authRouter = require('./route/auth.route')
const userRouter = require('./route/user.route')
const app = express();

app.use(express.json());


app.use("/api", authRouter);
app.use("/api", userRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`.blue);
})