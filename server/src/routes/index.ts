import express from "express";
import auth from "./auth";
import invoices from "./invoices";
import clients from "./clients";

const router = express.Router();

router.use("/auth", auth);
router.use("/invoices", invoices);
router.use("/clients", clients);

export default router;
