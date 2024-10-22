import express from "express";
import {
  sendInvoice,
  changeInvoiceStatus,
  deleteInvoice,
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice,
} from "../controller/invoices";
import { jwtMiddleware } from "../middleware/jwt";
import { get } from "http";
const router = express.Router();

router.get("/", jwtMiddleware, getAllInvoices);
router.get("/get/:invoiceId", jwtMiddleware, getInvoice);
router.put("/update/:invoiceId", jwtMiddleware, updateInvoice);
router.post("/", jwtMiddleware, createInvoice);
router.post("/send-invoice", jwtMiddleware, sendInvoice);
router.post("/change-status/:invoiceId", jwtMiddleware, changeInvoiceStatus);
router.delete("/:invoiceId", jwtMiddleware, deleteInvoice);
export default router;
