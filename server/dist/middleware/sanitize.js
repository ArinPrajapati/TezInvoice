"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeInput(input) {
    return input.replace(/[&<>"']/g, function (match) {
        const sanitizeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };
        return sanitizeMap[match];
    });
}
function sanitizeMiddleware(req, res, next) {
    for (const key in req.query) {
        if (typeof req.query[key] === "string") {
            req.query[key] = sanitizeInput(req.query[key]);
        }
    }
    for (const key in req.params) {
        if (typeof req.params[key] === "string") {
            req.params[key] = sanitizeInput(req.params[key]);
        }
    }
    if (req.body && typeof req.body === "object") {
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = sanitizeInput(req.body[key]);
            }
        }
    }
    next();
}
exports.default = sanitizeMiddleware;
