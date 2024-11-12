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
import convertCurrency, { CurrencyConversionError } from "../helper/currecyConverter";

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

    // Validate required fields
    const requiredFields = {
      jobDescription,
      items,
      totalAmount,
      dueDate,
      invoiceNumber,
      paymentMethod,
      currency,
      clientInfo,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    // Validate user
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return
    }

    if (!user.isVerified) {

      res.status(401).json({ message: "Please Verify Your Email" });
      return
    }

    console.log(clientInfo);
    const client_total = await convertCurrency(
      totalAmount,
      currency,
      clientInfo.currency
    );
    if (!client_total) {
      res.status(400).json({ message: "Invalid currency conversion for total amount" });
      return
    }

    try {
      const clientItems = await Promise.all(
        items.map(async (item) => {
          const price = await convertCurrency(
            item.price,
            currency,
            clientInfo.currency
          );

          if (!price) {
            throw new Error(`Invalid currency conversion for item: ${item.description}`);
          }

          return {
            description: item.description,
            quantity: item.quantity,
            price,
            subtotal: item.quantity * Number(price),
          };
        })
      );

      const invoice = await invoices.create({
        serviceName: user.serviceName,
        ownerName: user.name,
        jobDescription,
        ownerEmail: user.email,
        clientInfo,
        items,
        totalAmount,
        dueDate,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        userId: user._id,
        status: "unpaid",
        paymentLink: "",
        invoiceNumber,
        paymentMethod: paymentMethod as "offline" | "online",
        currency,
        clientItems,
        client_total,
      });

      if (!invoice) {
        _500("Failed to create invoice", "Database operation failed", res);
        return
      }

      res.status(200).json({ message: "Invoice Created" });
      return
    } catch (conversionError) {
      res.status(400).json({
        message: "Currency conversion failed",
        error: (conversionError as CurrencyConversionError).message
      });
      return
    }
  } catch (error) {
    _500("Create Invoice Failed", (error as Error).message, res);
    return;
  }
};

export const sendInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { invoiceId } = req.params;

    let invoice = await invoices.findOne({ _id: invoiceId });
    if (!invoice) {
      res.status(404).json({ message: "Invoice Not Found" });
      return;
    }
    if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    invoice.items = invoice.clientItems;
    invoice.totalAmount = invoice.client_total;

    const invoiceHelper = new InvoiceHelper(invoice as unknown as Invoice);
    const combination = invoiceHelper.getCombination(1, 1, 1, 1);
    const fileName = invoiceHelper.invoiceMaker.fileName;

    if (!fileName) {
      res.status(500).json({ message: "Failed to generate invoice" });
      return;
    }

    const filePath = path.join("./public/pdf", `invoice-${invoice._id}.pdf`);

    // Wait for file to be generated and check its existence
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!fs.existsSync(filePath)) {
      res.status(500).json({ message: "Failed to generate invoice file" });
      return;
    }

    await sendEmail({
      from: "hello@demomailtrap.com",
      to: "arinprajapati78@gmail.com",
      subject: "Invoice",
      text: "Invoice",
      html: invoiceTemplate(
        invoice.invoiceNumber as unknown as string,
        invoice.jobDescription as string,
        formatDate(invoice.dueDate?.toISOString() as string, "yyyy-MM-dd"),
        invoice.totalAmount as unknown as string,
        invoice.ownerName as string,
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

    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Invoice Sent" });
    return;
  } catch (error) {
    console.log("error", error);
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

export const downloadInvoice = async (req: Request, res: Response) => {
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

    const fileName = invoice.invoiceNumber + ".pdf";
    const filePath = path.join("./public/pdf", fileName);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Invoice file not found" });
      return;
    }

    const pdfContent = fs.readFileSync(filePath, { encoding: "base64" });
    console.log("pdfContent", pdfContent);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    res.send(pdfContent);
    return;

  } catch (error) {
    _500("Download Invoice Failed", (error as Error).message, res);
    return;
  }
}

