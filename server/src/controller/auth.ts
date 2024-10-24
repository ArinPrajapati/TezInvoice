import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { _500 } from "../helper/error";
import jwt from "jsonwebtoken";
import sendEmail from "../config/nodeMailler";
import Cryptr from "cryptr";
import {
  magicLinkTemplate,
  verifyEmailTemplate,
} from "../helper/emailtemplate";

const cryptr = new Cryptr(process.env.CRYPTR_KEY as string);

const signup = async (req: Request, res: Response): Promise<void> => {
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      serviceName,
    });

    if (!user) {
      _500("Failed to create user", "The Problem is in db", res);
      return;
    }

    res.status(201).json(user);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      _500("Signup Failed", error.message, res);
    } else {
      _500("Signup Failed", "An unknown error occurred", res);
    }
  }
};
/// set in cookies
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }
    const getUser = await User.findOne({ email });
    if (!getUser) {
      res.status(400).json({ message: "User with this email does not exist" });
    }
    const isMatch = await bcrypt.compare(password, getUser?.password || "");

    if (!isMatch) {
      res.status(401).json({
        message: "Invalid Password ",
      });
    }
    const token = jwt.sign(
      {
        id: getUser?._id,
      },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login Successfull",
      token: token,
    });
  } catch (error: any) {
    _500("Login Failed", error.message, res);
  }
};

const magicLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: "User Not Found ",
      });
    }

    const token = {
      token: jwt.sign(
        {
          id: user?._id,
        },
        process.env.JWT_SECRET as jwt.Secret,
        {
          expiresIn: "7d",
        }
      ),
      time: Date.now(),
    };

    const link = `${process.env.CLIENT_URL}/auth/login/${cryptr.encrypt(
      JSON.stringify(token)
    )}`;
    await sendEmail({
      from: "oleta73@ethereal.email",
      to: email,
      subject: "Magic Login Link",
      text: `Click on the link to login to your account ${link}`,
      html: magicLinkTemplate(link),
    });

    res.json({
      message: "Magic Login Link Sent",
    });
  } catch (error) {
    _500("Magic Login Failed", (error as Error).message, res);
  }
};

const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user?.password || "");
    if (!isMatch) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    _500("Update Password Failed", (error as Error).message, res);
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const { name, email, serviceName } = req.body;
    if (!name || !email || !serviceName) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    user.name = name;
    user.email = email;
    user.serviceName = serviceName;
    await user.save();

    res.status(200).json({ message: "User Updated" });
  } catch (error) {
    _500("Update Failed", (error as Error).message, res);
  }
};

const verifyEmailSend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    const encryptId = cryptr.encrypt(user._id.toString());
    sendEmail({
      from: "oleta73@ethereal.email",
      to: user.email,
      subject: "Verify Email",
      text: "Verify Email",
      html: verifyEmailTemplate(
        `${process.env.CLIENT_URL}/auth/verify/${encryptId}`
      ),
    });
    res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    _500("Verify Email Failed", (error as Error).message, res);
  }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }

    const decryptId = cryptr.decrypt(token);
    const user = await User.findOne({ _id: decryptId });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    _500("Verify Email Failed", (error as Error).message, res);
  }
};

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    res.status(200).json({ message: "User Found", data: user });
  } catch (error) {
    _500("Get User Failed", (error as Error).message, res);
  }
};
export {
  signup,
  login,
  magicLogin,
  updatePassword,
  update,
  verifyEmailSend,
  verifyEmail,
  getUser,
};
