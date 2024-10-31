import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["Free", "Professional", "Unlimited"],
      default: "Free",
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
      required: true,
    },
    invoicesLimit: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
