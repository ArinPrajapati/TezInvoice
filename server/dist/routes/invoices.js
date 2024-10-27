"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoices_1 = require("../controller/invoices");
const jwt_1 = require("../middleware/jwt");
const router = express_1.default.Router();
router.get("/", jwt_1.jwtMiddleware, invoices_1.getAllInvoices);
router.get("/get/:invoiceId", jwt_1.jwtMiddleware, invoices_1.getInvoice);
router.put("/update/:invoiceId", jwt_1.jwtMiddleware, invoices_1.updateInvoice);
router.post("/", jwt_1.jwtMiddleware, invoices_1.createInvoice);
router.post("/send-invoice", jwt_1.jwtMiddleware, invoices_1.sendInvoice);
router.post("/change-status/:invoiceId", jwt_1.jwtMiddleware, invoices_1.changeInvoiceStatus);
router.delete("/:invoiceId", jwt_1.jwtMiddleware, invoices_1.deleteInvoice);
exports.default = router;
