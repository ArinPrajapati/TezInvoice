"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

// Mock data for invoices
const mockInvoices = Array(50)
  .fill(null)
  .map((_, index) => ({
    id: `INV-${1000 + index}`,
    client: `Client ${index + 1}`,
    date: new Date(2023, 0, 1 + index),
    amount: Math.floor(Math.random() * 10000) / 100,
    status: Math.random() > 0.5 ? "Paid" : "Unpaid",
  }));

const SeeAllInvoicesModal = () => {
  const [open, setOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const resetFilters = () => {
    setClientFilter("");
    setDateFilter(undefined);
    setCurrentPage(1);
  };

  const filteredInvoices = mockInvoices.filter(
    (invoice) =>
      invoice.client.toLowerCase().includes(clientFilter.toLowerCase()) &&
      (!dateFilter || invoice.date.toDateString() === dateFilter.toDateString())
  );

  const pageCount = Math.ceil(filteredInvoices.length / itemsPerPage);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

        {/* Filter container with reset button */}
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

          {/* Reset filters button */}
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

        <div className="max-h-[300px] overflow-auto rounded-md border mt-4">
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
              {currentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <Link href={`/invoice/${invoice.id}`} key={invoice.id}>
                    <TableCell className="font-medium text-purple-900">
                      {invoice.id}
                    </TableCell>
                  </Link>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{format(invoice.date, "PPP")}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
            Page {currentPage} of {pageCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeeAllInvoicesModal;
