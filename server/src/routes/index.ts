import express from "express";
import auth from "./auth";
import invoices from "./invoices";
import clients from "./clients";
import { updateExchangeRates } from "../controller/exchangeRates"

const router = express.Router();


router.use("/auth", auth);
router.use("/invoices", invoices);
router.use("/clients", clients);
router.get("/update-exchange-rates", updateExchangeRates);

export default router;
