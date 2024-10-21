import { Address } from "nodemailer/lib/mailer";

export interface sendEmail {
  from: string | Address | undefined;
  to: string | Address | (string | Address)[] | undefined;
  subject: string;
  text: string;
  html: string;
  cc?: string;
}

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  _id: string;
}

export interface Invoice {
  _id: string;
  userId: string;
  serviceName: String;
  ownerName: String;
  ownerEmail: String;
  clientInfo: {
    name: string;
    email: string;
    address: string;
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
}
