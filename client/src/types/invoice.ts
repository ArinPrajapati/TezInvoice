export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  userId?: string;
  serviceName?: String;
  ownerName?: String;
  ownerEmail?: String;
  clientInfo?: {
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
  jobDescription?: string;
  totalAmount?: number;
  dueDate?: Date;
  status?: "unpaid" | "paid";
  paymentLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
