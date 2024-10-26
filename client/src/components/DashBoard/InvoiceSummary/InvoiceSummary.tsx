import React from "react";
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

// Mock data for recent invoices
const recentInvoices = [
  {
    id: "INV001",
    clientName: "Acme Corp",
    dueDate: "2023-07-15",
    status: "Unpaid",
    amount: 1500.0,
  },
  {
    id: "INV002",
    clientName: "Globex Inc",
    dueDate: "2023-07-10",
    status: "Paid",
    amount: 2750.5,
  },
  {
    id: "INV003",
    clientName: "Initech",
    dueDate: "2023-07-20",
    status: "Unpaid",
    amount: 900.0,
  },
  {
    id: "INV004",
    clientName: "Hooli",
    dueDate: "2023-07-05",
    status: "Paid",
    amount: 3200.75,
  },
  {
    id: "INV005",
    clientName: "Pied Piper",
    dueDate: "2023-07-25",
    status: "Unpaid",
    amount: 1800.25,
  },
];

const InvoiceSummary = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold  text-purple-700 bg-purple-200 p-4 rounded-t-lg">
        Recent Invoices
      </h2>
      <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-purple-100">
            <TableRow>
              <TableHead className="text-purple-600">Invoice Number</TableHead>
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
              <TableRow key={invoice.id} className="hover:bg-purple-50">
                <TableCell className="font-medium text-purple-900">
                  {invoice.id}
                </TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={invoice.status === "Paid" ? "default" : "outline"}
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
                  ${invoice.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Link href={`/invoice/${invoice.id}`}>
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
      </div>
    </div>
  );
};

export default InvoiceSummary;
