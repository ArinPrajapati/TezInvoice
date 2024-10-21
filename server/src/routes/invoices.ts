import express from "express";
import { sendInvoice } from "../controller/invoices";
const router = express.Router();

router.get("/", sendInvoice);

export default router;
