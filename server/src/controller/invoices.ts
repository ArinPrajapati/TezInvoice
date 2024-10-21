import invoices from "../models/invoices";
import sendEmail from "../config/nodeMailler";
import { Request, Response } from "express";
import { _500 } from "../helper/error";
import { Invoice } from "../types";
import jwt from "jsonwebtoken";
import User from "../models/user";

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
    });

    if (!invoice) {
      _500("Failed to create invoice", "The Problem is in db", res);
      return;
    }
  } catch (error) {
    _500("Create Invoice Failed", (error as Error).message, res);
  }
};
