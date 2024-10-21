import express from "express";
import auth from "./auth";
import invoices from "./invoices";

const router = express.Router();

router.use("/auth", auth);
router.use("/invoices", invoices);

export default router;
