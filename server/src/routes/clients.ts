import express from "express";
import { createClient, deleteClient, getClients } from "../controller/clients";
import { jwtMiddleware } from "../middleware/jwt";
const router = express.Router();

router.get("/", jwtMiddleware, getClients);
router.post("/", jwtMiddleware, createClient);
router.delete("/:id", jwtMiddleware, deleteClient);

export default router;
