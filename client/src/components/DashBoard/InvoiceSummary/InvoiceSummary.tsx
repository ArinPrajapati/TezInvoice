"use client";
import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Receipt } from "lucide-react";
import { InvoiceService } from "@/axios/service/invoiceService";
import { format } from "date-fns";
import { getCurrencySymbol } from "@/lib/moneySymbols";
import { Invoice } from "@/types/invoice";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 bg-white rounded-b-lg">
    <Receipt className="h-16 w-16 text-purple-200 mb-4" />
    <h3 className="text-lg font-semibold text-purple-900 mb-2">
      No Invoices Yet
    </h3>
    <p className="text-sm text-purple-600 mb-6 text-center max-w-sm">
      You haven't created any invoices yet. Start by creating your first
      invoice.
    </p>
    <Link href="/create/invoice">
      <Button className="bg-purple-600 text-white hover:bg-purple-700 inline-flex items-center">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Invoice
      </Button>
    </Link>
  </div>
);

const InvoiceSummary = () => {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  useEffect(() => {
    // Fetch recent invoices
    const fetchRecentInvoices = async () => {
      const response = await InvoiceService.getAllInvoices({
        clientName: "",
      });
      setRecentInvoices(response.data);
    };
    fetchRecentInvoices();
  }, []);
  const hasInvoices = recentInvoices.length > 0;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between bg-purple-200 p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-purple-700">Recent Invoices</h2>
        {hasInvoices && (
          <Link href="/create/invoice">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        )}
      </div>
      <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
        {hasInvoices ? (
          <Table>
            <TableHeader className="bg-purple-100">
              <TableRow>
                <TableHead className="text-purple-600">
                  Invoice Number
                </TableHead>
                <TableHead className="text-purple-600">Client Name</TableHead>
                <TableHead className="text-purple-600">Due Date</TableHead>
                <TableHead className="text-purple-600">Status</TableHead>
                <TableHead className="text-purple-600 text-right">
                  Amount
                </TableHead>
                <TableHead className="text-purple-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((invoice) => (
                <TableRow key={invoice._id} className="hover:bg-purple-50">
                  <TableCell className="font-medium text-purple-900">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice?.clientInfo?.name}</TableCell>
                  <TableCell>
                    {invoice.dueDate
                      ? format(new Date(invoice.dueDate), "MMM dd, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "paid" ? "default" : "outline"
                      }
                      className={
                        invoice.status === "paid"
                          ? "bg-purple-200 text-purple-800 hover:bg-purple-300"
                          : "border-purple-500 text-purple-700"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {getCurrencySymbol(invoice?.currency)}
                    {invoice?.totalAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/invoice/${invoice._id}`}>
                      <Button
                        variant={
                          invoice.status === "paid" ? "outline" : "default"
                        }
                        size="sm"
                        className={
                          invoice.status === "paid"
                            ? "border-purple-500 text-purple-700 hover:bg-purple-100"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }
                      >
                        {invoice.status === "paid" ? "View" : "Edit"}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default InvoiceSummary;
