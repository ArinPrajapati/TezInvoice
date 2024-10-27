"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.verifyEmail = exports.verifyEmailSend = exports.update = exports.updatePassword = exports.magicLogin = exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../helper/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodeMailler_1 = __importDefault(require("../config/nodeMailler"));
const cryptr_1 = __importDefault(require("cryptr"));
const emailtemplate_1 = require("../helper/emailtemplate");
const cryptr = new cryptr_1.default(process.env.CRYPTR_KEY);
const signup = async (req, res) => {
    try {
        const { name, email, password, serviceName } = req.body;
        if (!name || !email || !password || !serviceName) {
            res.status(400).json({ message: "Please fill all the fields" });
            return;
        }
        if (password.length < 6) {
            res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
            return;
        }
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists" });
            return;
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const user = await user_1.default.create({
            name,
            email,
            password: hashPassword,
            serviceName,
        });
        if (!user) {
            (0, error_1._500)("Failed to create user", "The Problem is in db", res);
            return;
        }
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            (0, error_1._500)("Signup Failed", error.message, res);
        }
        else {
            (0, error_1._500)("Signup Failed", "An unknown error occurred", res);
        }
    }
};
exports.signup = signup;
/// set in cookies
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Please fill all the fields" });
            return;
        }
        const getUser = await user_1.default.findOne({ email });
        if (!getUser) {
            res.status(400).json({ message: "User with this email does not exist" });
        }
        const isMatch = await bcrypt_1.default.compare(password, getUser?.password || "");
        if (!isMatch) {
            res.status(401).json({
                message: "Invalid Password ",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: getUser?._id,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            message: "Login Successfull",
            token: token,
        });
    }
    catch (error) {
        (0, error_1._500)("Login Failed", error.message, res);
    }
};
exports.login = login;
const magicLogin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                message: "Please fill all the fields",
            });
        }
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({
                message: "User Not Found ",
            });
        }
        const token = {
            token: jsonwebtoken_1.default.sign({
                id: user?._id,
            }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            }),
            time: Date.now(),
        };
        const link = `${process.env.CLIENT_URL}/auth/login/${cryptr.encrypt(JSON.stringify(token))}`;
        await (0, nodeMailler_1.default)({
            from: "oleta73@ethereal.email",
            to: email,
            subject: "Magic Login Link",
            text: `Click on the link to login to your account ${link}`,
            html: (0, emailtemplate_1.magicLinkTemplate)(link),
        });
        res.json({
            message: "Magic Login Link Sent",
        });
    }
    catch (error) {
        (0, error_1._500)("Magic Login Failed", error.message, res);
    }
};
exports.magicLogin = magicLogin;
const updatePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword) {
            res.status(400).json({ message: "Please fill all the fields" });
            return;
        }
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(oldPassword, user?.password || "");
        if (!isMatch) {
            res.status(401).json({ message: "Invalid Password" });
            return;
        }
        const hashPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({ message: "Password Updated" });
    }
    catch (error) {
        (0, error_1._500)("Update Password Failed", error.message, res);
    }
};
exports.updatePassword = updatePassword;
const update = async (req, res) => {
    try {
        const { id } = req.data;
        const { name, email, serviceName } = req.body;
        if (!name || !email || !serviceName) {
            res.status(400).json({ message: "Please fill all the fields" });
            return;
        }
        const user = await user_1.default.findOne({ _id: id });
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return;
        }
        user.name = name;
        user.email = email;
        user.serviceName = serviceName;
        await user.save();
        res.status(200).json({ message: "User Updated" });
    }
    catch (error) {
        (0, error_1._500)("Update Failed", error.message, res);
    }
};
exports.update = update;
const verifyEmailSend = async (req, res) => {
    try {
        const { id } = req.data;
        const user = await user_1.default.findOne({ _id: id });
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return;
        }
        const encryptId = cryptr.encrypt(user._id.toString());
        (0, nodeMailler_1.default)({
            from: "oleta73@ethereal.email",
            to: user.email,
            subject: "Verify Email",
            text: "Verify Email",
            html: (0, emailtemplate_1.verifyEmailTemplate)(`${process.env.CLIENT_URL}/auth/verify/${encryptId}`),
        });
        res.status(200).json({ message: "Email Verified" });
    }
    catch (error) {
        (0, error_1._500)("Verify Email Failed", error.message, res);
    }
};
exports.verifyEmailSend = verifyEmailSend;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ message: "Please fill all the fields" });
            return;
        }
        const decryptId = cryptr.decrypt(token);
        const user = await user_1.default.findOne({ _id: decryptId });
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return;
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: "Email Verified" });
    }
    catch (error) {
        (0, error_1._500)("Verify Email Failed", error.message, res);
    }
};
exports.verifyEmail = verifyEmail;
const getUser = async (req, res) => {
    try {
        const { id } = req.data;
        const user = await user_1.default.findOne({ _id: id });
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return;
        }
        res.status(200).json({ message: "User Found", data: user });
    }
    catch (error) {
        (0, error_1._500)("Get User Failed", error.message, res);
    }
};
exports.getUser = getUser;
