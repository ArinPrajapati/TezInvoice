import nodemailer from "nodemailer";
import { sendEmail } from "../types";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sddssdf964@gmail.com",
    pass: "zptdwbhdytmzzshk",
  },
  tls: {
    rejectUnauthorized: false,
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
    attachments: email.attachments,
  });

  console.log({
    message: "Message sent",
    id: info.messageId,
    email: info.envelope.to,
  });
};

export default sendEmail;
