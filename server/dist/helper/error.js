"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._500 = void 0;
const _500 = (message, errorMessage, res) => {
    return res.status(500).json({
        message: message,
        error: errorMessage || "Internal Server Error",
        remark: "Ahh!!! , I did not expect that to happen!! 😑 😑",
    });
};
exports._500 = _500;
