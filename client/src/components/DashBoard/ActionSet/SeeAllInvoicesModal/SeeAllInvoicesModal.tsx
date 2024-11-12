"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
  InboxIcon,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Invoice } from "@/types/invoice";
import { InvoiceService } from "@/axios/service/invoiceService";
import { getCurrencySymbol } from "@/lib/moneySymbols";

const SeeAllInvoicesModal = () => {
  const [open, setOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedClientFilter, setDebouncedClientFilter] =
    useState(clientFilter);
  const [debouncedDateFilter, setDebouncedDateFilter] = useState<
    Date | undefined
  >(dateFilter);
  const itemsPerPage = 5;

  const resetFilters = () => {
    setClientFilter("");
    setDateFilter(undefined);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedClientFilter(clientFilter);
      setDebouncedDateFilter(dateFilter);
    }, 500);

    return () => clearTimeout(handler);
  }, [clientFilter, dateFilter]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await InvoiceService.getAllInvoices({
          clientName: debouncedClientFilter,
          date: debouncedDateFilter,
          page: currentPage,
        });
        console.log(
          response.data.forEach((invoice) => console.log(invoice.invoiceNumber))
        );
        setInvoices(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };

    fetchInvoices();
  }, [debouncedClientFilter, debouncedDateFilter, currentPage]);

  const EmptyState = () => (
    <div className="py-12 text-center">
      <InboxIcon className="mx-auto h-12 w-12 text-purple-200" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        No invoices found
      </h3>
      <p className="mt-2 text-sm text-purple-500">
        {clientFilter || dateFilter
          ? "Try adjusting your filters or clear them to see more results"
          : "No invoices have been created yet"}
      </p>
      {(clientFilter || dateFilter) && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="mt-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-600 text-purple-700 hover:bg-purple-100 flex items-center justify-center h-12 rounded-md shadow-sm transition duration-200"
        >
          <FileText className="mr-2 h-5 w-5" />
          See All Invoices
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] w-full p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>All Invoices</DialogTitle>
          <DialogDescription>
            View and filter all your invoices. Use the search box and date
            picker to filter the results.
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientFilter">Filter by Client</Label>
              <Input
                id="clientFilter"
                placeholder="Enter client name..."
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFilter">Filter by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateFilter"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? (
                      format(dateFilter, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {(clientFilter || dateFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="max-h-[300px] overflow-auto rounded-md border mt-4">
          {invoices.length > 0 ? (
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell className="font-medium text-purple-900">
                      <Link href={`/invoice/${invoice._id}`} key={invoice._id}>
                        {invoice.invoiceNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{invoice?.clientInfo?.name}</TableCell>
                    <TableCell>{format(invoice.createdAt!, "PPP")}</TableCell>
                    <TableCell>
                      {getCurrencySymbol(invoice.currency)}
                      {invoice.totalAmount && invoice.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>{invoice.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Pagination */}
        {invoices.length > 0 && (
          <div className="flex items-center justify-between space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SeeAllInvoicesModal;
