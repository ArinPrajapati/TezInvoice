export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  userId?: string;
  serviceName?: string;
  ownerName?: string;
  ownerEmail?: string;
  clientInfo?: {
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
  jobDescription?: string;
  totalAmount?: number;
  dueDate?: Date;
  currency: string;
  status?: "unpaid" | "paid";
  paymentLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
