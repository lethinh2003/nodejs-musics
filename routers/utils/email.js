const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //     service: "Gmail",
  //     auth: {
  //         user: process.env.EMAIL_USERNAME,
  //         pass: process.env.EMAIL_PASSWORD,
  //     }
  // })
  // Gmail only//

  //mailtrap//
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
      user: "432135c49509cc",
      pass: "0d817140417654",
    },
  });
  const mailOptions = {
    from: "Van Thinh Le <lethinh.developer@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
