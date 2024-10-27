import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// const overdueInvoices = [
//   {
//     id: "INV006",
//     clientName: "TechCorp",
//     dueDate: "2023-06-30",
//     amount: 3500.0,
//     daysOverdue: 15,
//   },
//   {
//     id: "INV007",
//     clientName: "Initech",
//     dueDate: "2023-07-05",
//     amount: 1200.5,
//     daysOverdue: 10,
//   },
//   {
//     id: "INV008",
//     clientName: "Acme Inc",
//     dueDate: "2023-07-10",
//     amount: 2800.75,
//     daysOverdue: 5,
//   },
//   {
//     id: "INV009",
//     clientName: "Globex Corp",
//     dueDate: "2023-07-12",
//     amount: 950.25,
//     daysOverdue: 3,
//   },
//   {
//     id: "INV010",
//     clientName: "Umbrella Corp",
//     dueDate: "2023-07-14",
//     amount: 4200.0,
//     daysOverdue: 1,
//   },
// ];
const overdueInvoices: any[] = [];
const EmptyState = () => (
  <div className="py-12 text-center bg-white rounded-b-lg border-t">
    <CheckCircle2 className="mx-auto h-12 w-12 text-purple-500" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      No Outstanding Payments
    </h3>
    <p className="mt-2 text-sm text-gray-500">
      All invoices have been paid on time. Great job!
    </p>
  </div>
);

const UnPaidTable = () => {
  const hasOverdueInvoices = overdueInvoices.length > 0;
  const totalOutstanding = overdueInvoices
    .reduce((sum, invoice) => sum + invoice.amount, 0)
    .toFixed(2);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-purple-800 bg-purple-200 p-4 rounded-t-lg flex items-center">
        <AlertCircle className="mr-2 h-6 w-6 text-purple-600" />
        Outstanding Payments
      </h2>
      <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
        {hasOverdueInvoices ? (
          <Table>
            <TableHeader className="bg-purple-100">
              <TableRow>
                <TableHead className="text-purple-700">Invoice ID</TableHead>
                <TableHead className="text-purple-700">Client Name</TableHead>
                <TableHead className="text-purple-700">Due Date</TableHead>
                <TableHead className="text-purple-700 text-right">
                  Amount
                </TableHead>
                <TableHead className="text-purple-700">Status</TableHead>
                <TableHead className="text-purple-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-purple-50">
                  <TableCell className="font-medium text-purple-900">
                    <Link
                      href={`/invoice/${invoice.id}`}
                      className="hover:underline"
                    >
                      {invoice.id}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-purple-500" />
                      {invoice.dueDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-red-500 text-red-700"
                    >
                      {invoice.daysOverdue}{" "}
                      {invoice.daysOverdue === 1 ? "day" : "days"} overdue
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Send Reminder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState />
        )}
      </div>
      {hasOverdueInvoices && (
        <div className="mt-4 text-sm text-purple-600">
          <p>Total outstanding: ${totalOutstanding}</p>
        </div>
      )}
    </div>
  );
};

export default UnPaidTable;
