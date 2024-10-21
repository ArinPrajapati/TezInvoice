import express from "express";
import {
  login,
  magicLogin,
  signup,
  update,
  updatePassword,
  verifyEmail,
  verifyEmailSend,
} from "../controller/auth";
import { jwtMiddleware } from "../middleware/jwt";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/magic-login", magicLogin);
router.put("/update", jwtMiddleware, update);
router.put("/update-password", jwtMiddleware, updatePassword);
router.post("/verify-email-send", jwtMiddleware, verifyEmailSend);
router.post("/verify-email", verifyEmail);

export default router;
