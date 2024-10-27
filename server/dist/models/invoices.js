"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const invoiceSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    _id: String,
    serviceName: String,
    ownerName: String,
    clientInfo: {
        name: String,
        email: String,
        address: String,
    },
    items: [
        {
            description: String,
            quantity: Number,
            price: Number,
            subtotal: Number,
        },
    ],
    ownerEmail: String,
    jobDescription: String,
    totalAmount: Number,
    dueDate: Date,
    isSent: { type: Boolean, default: false },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    paymentLink: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
exports.default = mongoose_1.default.model("Invoice", invoiceSchema);
