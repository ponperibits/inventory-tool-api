const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const { emailConfig, resetPasswordUrl } = require("../../../config/variables");
const Email = require("email-templates");
const path = require("path");

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  port: emailConfig.port,
  host: emailConfig.host,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error(error);
    console.log("error with email connection");
  }
});

exports.sendEmailVerification = async (verificationObj) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: emailConfig.username,
    },
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "emailVerification",
      message: {
        to: verificationObj.email,
      },
      locals: {
        productName: "Inventory Tool",
        verificationCode: verificationObj.code,
        year: moment().year(),
      },
      attachments: [],
    })
    .catch((err) => console.log("Unable to send verification email. ", err));
};
