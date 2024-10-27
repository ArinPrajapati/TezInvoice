"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectDb_1 = require("./config/connectDb");
const sanitize_1 = __importDefault(require("./middleware/sanitize"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(sanitize_1.default);
(0, connectDb_1.connectDB)();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api", routes_1.default);
app.listen(4000, () => {
    console.log("Server is running on port 3000");
});
