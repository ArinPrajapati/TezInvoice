import { headers } from "next/headers";
import { api } from "../api";
import { Invoice } from "@/types/invoice";

interface getAllInvoicesResponse {
  message: string;
  data: Invoice[];
  currentPage: number;
  totalPages: number;
  totalInvoices: number;
}

interface getInvoiceByIdResponse {
  message: string;
  data: Invoice;
}
export class InvoiceService {
  static async createInvoice(invoice: Invoice): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/invoices", invoice);
    return response.data;
  }
  static async getAllInvoices({
    clientName,
    page = 1,
    date,
  }: {
    clientName?: string;
    page?: number;
    date?: string;
  }): Promise<getAllInvoicesResponse> {
    const response = await api.get<getAllInvoicesResponse>(
      `invoices?clientName=${clientName}&page=${page}&date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    return response.data;
  }
  static async getInvoiceById(id: string): Promise<getInvoiceByIdResponse> {
    const response = await api.get<getInvoiceByIdResponse>(
      `/invoices/get/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    return response.data;
  }
  static async updateInvoice(invoice: Invoice): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(
      `/invoices/update/${invoice._id}`,
      invoice
    );
    return response.data;
  }
  static async deleteInvoice(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `/invoices/delete/${id}`
    );
    return response.data;
  }
  static async sendInvoice(id: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/invoices/send-invoice/${id}`
    );
    return response.data;
  }
  static async getUnpaidInvoices(): Promise<Invoice[]> {
    const response = await api.get<Invoice[]>("/invoices?status=unpaid");
    return response.data;
  }
}
