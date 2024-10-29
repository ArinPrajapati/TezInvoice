"use client"

import React, { useEffect, useState } from "react";
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
import {
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Loader2,
  DollarSign,
  Coins,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";
import { InvoiceService } from "@/axios/service/invoiceService";
import { format, isBefore, isToday, differenceInDays } from "date-fns";
import { Invoice } from "@/types/invoice";

// Types for invoice status
type InvoiceStatus = "overdue" | "due-today" | "unpaid";

interface InvoiceWithStatus extends Invoice {
  derivedStatus: InvoiceStatus;
  daysOverdue: number;
}

// Utility functions for date and status handling
const getInvoiceStatus = (
  dueDate: Date | undefined
): { status: InvoiceStatus; daysOverdue: number } => {
  if (!dueDate) {
    return { status: "unpaid", daysOverdue: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateNormalized = new Date(dueDate);
  dueDateNormalized.setHours(0, 0, 0, 0);

  if (isToday(dueDateNormalized)) {
    return { status: "due-today", daysOverdue: 0 };
  }

  if (isBefore(dueDateNormalized, today)) {
    const daysOverdue = differenceInDays(today, dueDateNormalized);
    return { status: "overdue", daysOverdue };
  }

  return { status: "unpaid", daysOverdue: 0 };
};

const getStatusStyle = (status: InvoiceStatus) => {
  switch (status) {
    case "overdue":
      return "border-red-500 text-red-700 bg-red-50";
    case "due-today":
      return "border-yellow-500 text-yellow-700 bg-yellow-50";
    default:
      return "border-purple-500 text-purple-700 bg-purple-50";
  }
};

const formatDaysOverdue = (days: number): string => {
  if (days === 0) return "";
  if (days === 1) return "(1 day overdue)";
  return `(₹{days} days overdue)`;
};

// Component States
const EmptyState: React.FC = () => (
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

const LoadingState: React.FC = () => (
  <div className="py-12 text-center bg-white rounded-b-lg border-t">
    <Loader2 className="mx-auto h-12 w-12 text-purple-500 animate-spin" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Loading Invoices...
    </h3>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="py-12 text-center bg-white rounded-b-lg border-t">
    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Error Loading Invoices
    </h3>
    <p className="mt-2 text-sm text-red-500">{error}</p>
  </div>
);

const UnPaidTable: React.FC = () => {
  const [unpaidInvoices, setUnpaidInvoices] = useState<InvoiceWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await InvoiceService.getUnpaidInvoices();

        // Process invoices to add derived status
        const processedInvoices = response.data.map((invoice: Invoice) => {
          const { status, daysOverdue } = getInvoiceStatus(invoice.dueDate);
          return {
            ...invoice,
            derivedStatus: status,
            daysOverdue,
          };
        });

        // Sort by overdue status and days overdue
        const sortedInvoices = processedInvoices.sort((a, b) => {
          if (a.derivedStatus === "overdue" && b.derivedStatus !== "overdue")
            return -1;
          if (a.derivedStatus !== "overdue" && b.derivedStatus === "overdue")
            return 1;
          return b.daysOverdue - a.daysOverdue;
        });

        setUnpaidInvoices(sortedInvoices);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch invoices"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const totalOutstanding = unpaidInvoices
    .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0)
    .toFixed(2);

  const handleSendReminder = async (invoiceId: string) => {
    try {
      // Add your reminder logic here
      console.log(`Sending reminder for invoice ₹{invoiceId}`);
    } catch (err) {
      console.error("Failed to send reminder:", err);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!unpaidInvoices.length) return <EmptyState />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center bg-purple-200 p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center">
          <AlertCircle className="mr-2 h-6 w-6 text-purple-600" />
          Outstanding Payments
        </h2>
        <div className="flex items-center bg-white px-4 py-2 rounded-lg">
          <IndianRupee   className="h-5 w-5 text-purple-600 mr-2" />
          <span className="font-semibold text-purple-800">
            Total: ₹{totalOutstanding}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-purple-100">
            <TableRow>
              <TableHead className="text-purple-700">Invoice #</TableHead>
              <TableHead className="text-purple-700">Service</TableHead>
              <TableHead className="text-purple-700">Client</TableHead>
              <TableHead className="text-purple-700">Due Date</TableHead>
              <TableHead className="text-purple-700 text-right">
                Amount
              </TableHead>
              <TableHead className="text-purple-700">Status</TableHead>
              <TableHead className="text-purple-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unpaidInvoices.map((invoice) => (
              <TableRow
                key={invoice._id}
                className={`hover:bg-purple-50 ₹{
                  invoice.derivedStatus === "overdue" ? "bg-red-50" : ""
                }`}
              >
                <TableCell className="font-medium text-purple-900">
                  <Link
                    href={`/invoice/₹{invoice._id}`}
                    className="hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>{invoice.serviceName || "N/A"}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {invoice.clientInfo?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.clientInfo?.email || ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-purple-500" />
                    {invoice.dueDate
                      ? format(new Date(invoice.dueDate), "MMM dd, yyyy")
                      : "N/A"}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{invoice.totalAmount?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell>
                  <div>
                    <Badge
                      variant="outline"
                      className={getStatusStyle(invoice.derivedStatus)}
                    >
                      {invoice.derivedStatus === "overdue"
                        ? "Overdue"
                        : invoice.derivedStatus === "due-today"
                        ? "Due Today"
                        : "Unpaid"}
                    </Badge>
                    {invoice.daysOverdue > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        {formatDaysOverdue(invoice.daysOverdue)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className={`text-white ₹{
                        invoice.derivedStatus === "overdue"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      onClick={() => handleSendReminder(invoice._id!)}
                    >
                      Send Reminder
                    </Button>
                    {invoice.paymentLink && (
                      <Link href={invoice.paymentLink} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-600 text-purple-700 hover:bg-purple-50"
                        >
                          View Payment
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UnPaidTable;
