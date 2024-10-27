"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const jwt_1 = require("../middleware/jwt");
const router = express_1.default.Router();
router.post("/signup", auth_1.signup);
router.post("/login", auth_1.login);
router.get("/user", jwt_1.jwtMiddleware, auth_1.getUser);
router.post("/magic-login", auth_1.magicLogin);
router.put("/update", jwt_1.jwtMiddleware, auth_1.update);
router.put("/update-password", jwt_1.jwtMiddleware, auth_1.updatePassword);
router.post("/verify-email-send", jwt_1.jwtMiddleware, auth_1.verifyEmailSend);
router.post("/verify-email", auth_1.verifyEmail);
exports.default = router;
