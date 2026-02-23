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
    date?: Date;
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
  static async getUnpaidInvoices(): Promise<getAllInvoicesResponse> {
    const response = await api.get<getAllInvoicesResponse>("/invoices?status=unpaid");
    return response.data;
  }
  static async downloadInvoice(id: string): Promise<void> {
    const response = await api.get(`/invoices/download/${id}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const blob = new Blob([response.data], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `invoice-${id}.pdf`;

    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  }
}
