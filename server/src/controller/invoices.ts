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
import { invoiceTemplate } from "../helper/emailtemplate";
import { formatDate } from "date-fns";
import ExchangeRate from "../models/exchangeRates";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const {
      clientInfo,
      items,
      totalAmount,
      dueDate,
      jobDescription,
      invoiceNumber,
      paymentMethod,
      createdAt,
      currency,
    } = req.body as Invoice;

    if (!jobDescription || !items || !totalAmount || !dueDate || !invoiceNumber || !paymentMethod || !currency) {
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

    const exchangeRate = await ExchangeRate.findById(currency);
    if (!exchangeRate) {
      res.status(400).json({ message: "Currency exchange rate not found" });
      return;
    }

    const normalizedItems = items.map(item => {
      const normalizedPrice = (item.price ?? 0) * exchangeRate.rate;
      const normalizedSubtotal = normalizedPrice * item.quantity;
      return {
        ...item,
        price: normalizedPrice,
        subtotal: normalizedSubtotal,
      };
    });

    const normalizedTotalAmount = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const invoice = await invoices.create({
      serviceName: user.serviceName,
      ownerName: user.name,
      jobDescription,
      ownerEmail: user.email,
      clientInfo,
      items: normalizedItems,
      totalAmount: normalizedTotalAmount,
      currency,
      dueDate,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      userId: user._id,
      status: "unpaid",
      paymentLink: "",
      invoiceNumber,
      paymentMethod: paymentMethod as "offline" | "online",
    });

    if (!invoice) {
      res.status(500).json({ message: "Failed to create invoice", error: "The problem is in the database" });
      return;
    }

    res.status(200).json({ message: "Invoice Created", invoice });
    return;
  } catch (error) {
    res.status(500).json({ message: "Create Invoice Failed", error: (error as Error).message });
    return;
  }
};

export const sendInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { invoiceId } = req.params;

    // Find the invoice in the database
    const invoice = await invoices.findOne({ _id: invoiceId });
    if (!invoice) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    if (invoice.userId?.toString() !== id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const exchangeRate = await ExchangeRate.findById(invoice.clientInfo?.currency);
    if (!exchangeRate) {
      res.status(400).json({ message: "Currency exchange rate not found" });
      return;
    }

    const normalizedItems = invoice.items.map(item => {
      const normalizedPrice = item?.price! * exchangeRate.rate;
      const normalizedSubtotal = normalizedPrice * item.quantity!;
      return {
        ...item,
        price: normalizedPrice,
        subtotal: normalizedSubtotal,
      };
    });

    const normalizedTotalAmount = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const invoiceHelper = new InvoiceHelper({
      ...invoice,
      items: normalizedItems,
      totalAmount: normalizedTotalAmount,
    } as unknown as Invoice);

    await invoiceHelper.getCombination(1, 1, 1, 1);
    const fileName = invoiceHelper.invoiceMaker.fileName;
    if (!fileName) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    const filePath = path.join("./public/pdf", fileName);

    // Verify that the PDF file was created
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Invoice file not found" });
      return;
    }

    // Convert PDF to base64
    const pdfContent = fs.readFileSync(filePath, { encoding: "base64" });

    // Send email with the recalculated invoice
    await sendEmail({
      from: "hello@demomailtrap.com",
      to: invoice?.clientInfo?.email!,
      subject: "Invoice",
      text: "Invoice",
      html: invoiceTemplate(
        invoice._id.toString(),
        invoice?.jobDescription!,
        formatDate(invoice.dueDate ? invoice.dueDate.toISOString() : "", "yyyy-MM-dd"),
        normalizedTotalAmount.toFixed(2)
      ),
      attachments: [
        {
          filename: "invoice.pdf",
          path: filePath,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });

    // Clean up the PDF file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Invoice Sent" });
  } catch (error) {
    res.status(500).json({ message: "Send Invoice Failed", error: (error as Error).message });
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

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { invoiceId } = req.params;
    const { jobDescription, clientInfo, items, totalAmount, dueDate } =
      req.body;
    const invoice = await invoices.findOne({ _id: invoiceId });
    if (!invoice) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (invoice.status === "paid") {
      res
        .status(400)
        .json({ message: "Invoice Already Paid Cannot Be Updated" });
      return;
    }
    invoice.jobDescription = jobDescription;
    invoice.clientInfo = clientInfo;
    invoice.items = items;
    invoice.totalAmount = totalAmount;
    invoice.dueDate = dueDate;
    await invoice.save();
    res.status(200).json({ message: "Invoice Updated" });
    return;
  } catch (error) {
    _500("Update Invoice Failed", (error as Error).message, res);
    return;
  }
};

export const changeInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { invoiceId } = req.params;
    const { status } = req.body;
    const invoice = await invoices.findOne({ _id: invoiceId });
    if (!invoice) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    invoice.status = status;
    await invoice.save();
    res.status(200).json({ message: "Invoice Status Updated" });
    return;
  } catch (error) {
    _500("Change Invoice Status Failed", (error as Error).message, res);
    return;
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { invoiceId } = req.params;
    const invoice = await invoices.findOne({ _id: invoiceId });
    if (!invoice) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    await invoices.findByIdAndDelete(invoiceId);
    res.status(200).json({ message: "Invoice Deleted" });
    return;
  } catch (error) {
    _500("Delete Invoice Failed", (error as Error).message, res);
    return;
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { search, clientName, page = 1, limit = 5, date, status } = req.query;

    const limitNum = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * limitNum;

    // Construct the query object
    const query: any = { userId: id };

    if (clientName) {
      query["clientInfo.name"] = { $regex: clientName, $options: "i" };
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (date && date !== "undefined") {
      const formattedDate = new Date(date as string);
      if (!isNaN(formattedDate.getTime())) {
        query.createdAt = { $gte: formattedDate };
      } else {
        console.error("Invalid date format:", date);
        res.status(400).json({ message: "Invalid date format" });
        return;
      }
    }

    if (status) {
      query.status = status;
    }

    // Log the query for debugging
    console.log("Query:", query);

    const invoicesList = await invoices.find(query).skip(skip).limit(limitNum);
    const totalInvoices = await invoices.countDocuments(query);

    res.status(200).json({
      message: "Invoices Found",
      data: invoicesList,
      currentPage: parseInt(page as string, 10),
      totalPages: Math.ceil(totalInvoices / limitNum),
      totalInvoices,
    });
    return;
  } catch (error) {
    _500("Get All Invoices Failed", (error as Error).message, res);
    return;
  }
};


