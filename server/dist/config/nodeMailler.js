"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
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
const sendEmail = async (email) => {
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
exports.default = sendEmail;
