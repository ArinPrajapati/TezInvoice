import { Address } from "nodemailer/lib/mailer";

export interface sendEmail {
  from?: string | Address | undefined;
  to: string | Address | (string | Address)[] | undefined;
  subject: string;
  text: string;
  html: string;
  cc?: string;
  attachments?: any;
}

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  _id: string;
  serviceName: string;
  password: string;
  isVerified: boolean;
}

export interface Invoice {
  _id: any;
  invoiceNumber: string;
  userId: string;
  serviceName: String;
  ownerName: String;
  ownerEmail: String;
  currency: string;
  clientInfo: {
    name: string;
    email: string;
    address: string;
    currency: string;
  };
  items: {
    description: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  jobDescription: string;
  totalAmount: number;
  dueDate: Date;
  status: "unpaid" | "paid";
  paymentLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
  paymentMethod?: "offline" | "online";
}
