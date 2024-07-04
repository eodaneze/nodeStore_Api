const nodemailer = require('nodemailer');
const hbs = require("nodemailer-express-handlebars");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const {EMAIL_USER, EMAIL_PASSWORD} = process.env;

// configure nodemailer

const transporter = nodemailer.createTransport({
     service: "Gmail",
     auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
     }
})


// configure handlebars

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./templates/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./templates/"),
    extName: ".handlebars",
  })
);

module.exports = transporter