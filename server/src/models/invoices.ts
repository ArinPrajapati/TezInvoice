import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  invoiceNumber: String,
  serviceName: String,
  ownerName: String,
  clientInfo: {
    name: String,
    email: String,
    currency: String,
  },
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
      subtotal: Number,
    },
  ],
  clientItems: [
    {
      description: String,
      quantity: Number,
      price: Number,
      subtotal: Number,
    },
  ],
  client_total: Number,
  ownerEmail: String,
  jobDescription: String,
  totalAmount: Number,
  dueDate: Date,
  currency: { type: String, default: "USD" },
  paymentMethod: { type: String, enum: ["offline", "online"] },
  isSent: { type: Boolean, default: false },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  paymentLink: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.model("Invoice", invoiceSchema);
