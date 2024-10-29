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

// Mock data for recent invoices
// const recentInvoices = [
//   {
//     id: "INV001",
//     clientName: "Acme Corp",
//     dueDate: "2023-07-15",
//     status: "Unpaid",
//     amount: 1500.0,
//   },
//   {
//     id: "INV002",
//     clientName: "Globex Inc",
//     dueDate: "2023-07-10",
//     status: "Paid",
//     amount: 2750.5,
//   },
//   {
//     id: "INV003",
//     clientName: "Initech",
//     dueDate: "2023-07-20",
//     status: "Unpaid",
//     amount: 900.0,
//   },
//   {
//     id: "INV004",
//     clientName: "Hooli",
//     dueDate: "2023-07-05",
//     status: "Paid",
//     amount: 3200.75,
//   },
//   {
//     id: "INV005",
//     clientName: "Pied Piper",
//     dueDate: "2023-07-25",
//     status: "Unpaid",
//     amount: 1800.25,
//   },
// ];

const recentInvoices: any[] = [];

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
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
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
          <Link href="/invoice/new">
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
                    {format(invoice.dueDate, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "Paid" ? "default" : "outline"
                      }
                      className={
                        invoice.status === "Paid"
                          ? "bg-purple-200 text-purple-800 hover:bg-purple-300"
                          : "border-purple-500 text-purple-700"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{invoice?.totalAmount?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/invoice/${invoice._id}`}>
                      <Button
                        variant={
                          invoice.status === "Paid" ? "outline" : "default"
                        }
                        size="sm"
                        className={
                          invoice.status === "Paid"
                            ? "border-purple-500 text-purple-700 hover:bg-purple-100"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }
                      >
                        {invoice.status === "Paid" ? "View" : "Edit"}
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
