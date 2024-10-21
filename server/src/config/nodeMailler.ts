import nodemailer from "nodemailer";
import { sendEmail } from "../types";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "oleta73@ethereal.email",
    pass: "3uHFFHYMSaKqqz9Har",
  },
});

// check mail on https://ethereal.email/messages

const sendEmail = async (email: sendEmail) => {
  const info = await transporter.sendMail({
    from: email.from,
    cc: email.cc || " ",
    to: email.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  console.log({
    message: "Message sent",
    id: info.messageId,
    email: info.envelope.to,
  });
};

export default sendEmail;
