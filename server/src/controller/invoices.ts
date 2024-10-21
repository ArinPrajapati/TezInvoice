import invoices from "../models/invoices";
import sendEmail from "../config/nodeMailler";
import { Request, Response } from "express";
import { _500 } from "../helper/error";
import { Invoice } from "../types";
import jwt from "jsonwebtoken";
import User from "../models/user";
import fs from "fs";
import InvoiceHelper from "../helper/invoiceTemplates";
import path from "path";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { clientInfo, items, totalAmount, dueDate, jobDescription } =
      req.body as Invoice;

    if (
      !clientInfo.address ||
      !jobDescription ||
      !clientInfo.email ||
      !clientInfo.name ||
      !items ||
      !totalAmount ||
      !dueDate
    ) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    if (user.isVerified === false) {
      res.status(401).json({ message: "Please Verify Your Email" });
      return;
    }

    const invoice = await invoices.create({
      serviceName: user.serviceName,
      ownerName: user.name,
      jobDescription: jobDescription,
      ownerEmail: user.email,
      clientInfo,
      items,
      totalAmount,
      dueDate,
      userId: user._id,
      status: "unpaid",
      paymentLink: "",
    });

    if (!invoice) {
      _500("Failed to create invoice", "The Problem is in db", res);
      return;
    }

    res.status(200).json({ message: "Invoice Created" });
    return;
  } catch (error) {
    _500("Create Invoice Failed", (error as Error).message, res);
    return;
  }
};

export const sendInvoice = async (req: Request, res: Response) => {
  try {
    // const { id } = req.data as jwt.JwtPayload;
    // const { invoiceId } = req.params;
    // const invoice = await invoices.findOne({ _id: invoiceId });
    // if (!invoice) {
    //   res.status(404).json({ message: "Invoice Not Found" });
    //   return;
    // }
    // if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
    //   res.status(401).json({ message: "Unauthorized" });
    //   return;
    // }

    // const invoiceHelper = new InvoiceHelper(invoice as unknown as Invoice);
    const invoiceData: Invoice = {
      _id: "123456789",
      clientInfo: {
        name: "John Doe",
        email: "arinprajapati48@gmail.com",
        address: "123 Main St, Anytown, USA",
      },
      items: [
        {
          description: "Website Design",
          quantity: 1,
          price: 500,
          subtotal: 500,
        },
        {
          description: "Hosting (1 year)",
          quantity: 1,
          price: 100,
          subtotal: 100,
        },
      ],
      jobDescription: "Website development and hosting services.",
      totalAmount: 600,
      dueDate: new Date(),
      ownerEmail: "john@example.com",
      ownerName: "John Doe",
      serviceName: "Website Development",
      status: "unpaid",
      userId: "123456789",
      createdAt: new Date(),
      paymentLink: "https://example.com/payments/123456789",
      updatedAt: new Date(),
    };
    const invoiceHelper = new InvoiceHelper(invoiceData);
    await invoiceHelper.getCombination(1, 1, 1, 1);
    const fileName = invoiceHelper.getFileName(1, 1, 1, 1);

    if (!fileName) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    // const filePath = path.join(__dirname, `../../${fileName}`);
    const filePath = `./${fileName}`;

    console.log("filePath", filePath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Invoice file not found" });
      return;
    }

    const pdfContent = fs.readFileSync(fileName);
    console.log("pdfContent", pdfContent);

    // await sendEmail({
    //   from: "hello@demomailtrap.com",
    //   to: "arinprajapati78@gmail.com",
    //   subject: "Invoice",
    //   text: "Invoice",
    //   html: "Hello",
    //   attachments: [
    //     {
    //       filename: "invoice.pdf",
    //       content: pdfContent,
    //       encoding: "base64",
    //       contentType: "application/pdf",
    //     },
    //   ],
    // });
    res.status(200).json({ message: "Invoice Sent" });
    return;
  } catch (error) {
    _500("Send Invoice Failed", (error as Error).message, res);
    return;
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const invoiceID = req.params.invoiceId;

    const invoice = await invoices.findOne({ _id: invoiceID });
    if (!invoice) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json({ message: "Invoice Found", data: invoice });
    return;
  } catch (error) {
    _500("Get Invoice Failed", (error as Error).message, res);
    return;
  }
};
