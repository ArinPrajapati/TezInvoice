"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInvoices = exports.deleteInvoice = exports.changeInvoiceStatus = exports.updateInvoice = exports.getInvoice = exports.sendInvoice = exports.createInvoice = void 0;
const invoices_1 = __importDefault(require("../models/invoices"));
const nodeMailler_1 = __importDefault(require("../config/nodeMailler"));
const error_1 = require("../helper/error");
const user_1 = __importDefault(require("../models/user"));
const fs_1 = __importDefault(require("fs"));
const invoiceTemplates_1 = __importDefault(require("../helper/invoiceTemplates"));
const path_1 = __importDefault(require("path"));
const emailtemplate_1 = require("../helper/emailtemplate");
const date_fns_1 = require("date-fns");
const createInvoice = async (req, res) => {
    try {
        const { id } = req.data;
        const { clientInfo, items, totalAmount, dueDate, jobDescription } = req.body;
        if (!clientInfo.address ||
            !jobDescription ||
            !clientInfo.email ||
            !clientInfo.name ||
            !items ||
            !totalAmount ||
            !dueDate) {
            res.status(400).json({ message: "Please fill all the fields" });
            return;
        }
        const user = await user_1.default.findOne({ _id: id });
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return;
        }
        if (user.isVerified === false) {
            res.status(401).json({ message: "Please Verify Your Email" });
            return;
        }
        const invoice = await invoices_1.default.create({
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
            (0, error_1._500)("Failed to create invoice", "The Problem is in db", res);
            return;
        }
        res.status(200).json({ message: "Invoice Created" });
        return;
    }
    catch (error) {
        (0, error_1._500)("Create Invoice Failed", error.message, res);
        return;
    }
};
exports.createInvoice = createInvoice;
const sendInvoice = async (req, res) => {
    try {
        const { id } = req.data;
        const { invoiceId } = req.params;
        const invoice = await invoices_1.default.findOne({ _id: invoiceId });
        if (!invoice) {
            res.status(404).json({ message: "Invoice Not Found" });
            return;
        }
        if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const invoiceHelper = new invoiceTemplates_1.default(invoice);
        await invoiceHelper.getCombination(1, 1, 1, 1);
        const fileName = invoiceHelper.invoiceMaker.fileName;
        if (!fileName) {
            res.status(404).json({ message: "Invoice Not Found" });
            return;
        }
        const filePath = path_1.default.join("./public/pdf", fileName);
        console.log("filePath", filePath);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ message: "Invoice file not found" });
            return;
        }
        const pdfContent = fs_1.default.readFileSync(filePath, { encoding: "base64" });
        console.log("pdfContent", pdfContent);
        await (0, nodeMailler_1.default)({
            from: "hello@demomailtrap.com",
            to: "arinprajapati78@gmail.com",
            subject: "Invoice",
            text: "Invoice",
            html: (0, emailtemplate_1.invoiceTemplate)(invoice._id, invoice.jobDescription, (0, date_fns_1.formatDate)(invoice.dueDate?.toISOString(), "yyyy-MM-dd"), invoice.totalAmount),
            attachments: [
                {
                    filename: "invoice.pdf",
                    path: filePath,
                    encoding: "base64",
                    contentType: "application/pdf",
                },
            ],
        });
        fs_1.default.unlinkSync(filePath);
        res.status(200).json({ message: "Invoice Sent" });
        return;
    }
    catch (error) {
        (0, error_1._500)("Send Invoice Failed", error.message, res);
        return;
    }
};
exports.sendInvoice = sendInvoice;
const getInvoice = async (req, res) => {
    try {
        const { id } = req.data;
        const invoiceID = req.params.invoiceId;
        const invoice = await invoices_1.default.findOne({ _id: invoiceID });
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
    }
    catch (error) {
        (0, error_1._500)("Get Invoice Failed", error.message, res);
        return;
    }
};
exports.getInvoice = getInvoice;
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.data;
        const { invoiceId } = req.params;
        const { jobDescription, clientInfo, items, totalAmount, dueDate } = req.body;
        const invoice = await invoices_1.default.findOne({ _id: invoiceId });
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
    }
    catch (error) {
        (0, error_1._500)("Update Invoice Failed", error.message, res);
        return;
    }
};
exports.updateInvoice = updateInvoice;
const changeInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.data;
        const { invoiceId } = req.params;
        const { status } = req.body;
        const invoice = await invoices_1.default.findOne({ _id: invoiceId });
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
    }
    catch (error) {
        (0, error_1._500)("Change Invoice Status Failed", error.message, res);
        return;
    }
};
exports.changeInvoiceStatus = changeInvoiceStatus;
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.data;
        const { invoiceId } = req.params;
        const invoice = await invoices_1.default.findOne({ _id: invoiceId });
        if (!invoice) {
            res.status(404).json({ message: "Invoice Not Found" });
            return;
        }
        if (invoice && invoice.userId && invoice?.userId.toString() !== id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        await invoices_1.default.findByIdAndDelete(invoiceId);
        res.status(200).json({ message: "Invoice Deleted" });
        return;
    }
    catch (error) {
        (0, error_1._500)("Delete Invoice Failed", error.message, res);
        return;
    }
};
exports.deleteInvoice = deleteInvoice;
const getAllInvoices = async (req, res) => {
    try {
        const { id } = req.data;
        const { search, clientName, clientEmail, clientAddress, page = 1, limit = 10, } = req.query;
        const limitNum = parseInt(limit, 10);
        const skip = (parseInt(page, 10) - 1) * limitNum;
        const query = { userId: id };
        if (clientName || clientEmail || clientAddress) {
            query["clientInfo"] = {};
            if (clientName) {
                query["clientInfo"].name = { $regex: clientName, $options: "i" };
            }
            if (clientEmail) {
                query["clientInfo"].email = { $regex: clientEmail, $options: "i" };
            }
            if (clientAddress) {
                query["clientInfo"].address = { $regex: clientAddress, $options: "i" };
            }
        }
        if (search) {
            query.$or = [
                { invoiceNumber: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const invoicesList = await invoices_1.default.find(query).skip(skip).limit(limitNum);
        const totalInvoices = await invoices_1.default.countDocuments(query);
        res.status(200).json({
            message: "Invoices Found",
            data: invoicesList,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalInvoices / limitNum),
            totalInvoices,
        });
        return;
    }
    catch (error) {
        (0, error_1._500)("Get All Invoices Failed", error.message, res);
        return;
    }
};
exports.getAllInvoices = getAllInvoices;
