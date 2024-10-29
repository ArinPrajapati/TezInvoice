import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Send } from "lucide-react";
import Link from "next/link";
import { Invoice } from "@/types/invoice";

const SeeInvoicePage = ({ invoiceData }: { invoiceData: Invoice }) => {
  console.log(invoiceData);
  return (
    <div className="container mx-auto p-6">
      <Link href={"/dashboard"}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
        </Button>
      </Link>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {invoiceData?.invoiceNumber}
              </CardTitle>
              <CardDescription>
                Issued on{" "}
                {invoiceData?.createdAt
                  ? new Date(invoiceData.createdAt).toLocaleDateString()
                  : "N/A"}
              </CardDescription>
            </div>
            <Badge
              variant={
                invoiceData?.status === "paid" ? "default" : "destructive"
              }
            >
              {invoiceData?.status?.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-semibold mb-1">Billed To:</h3>
              <p>{invoiceData?.clientInfo?.name}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-1">Due Date:</h3>
              <p>
                {invoiceData?.dueDate
                  ? new Date(invoiceData.dueDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData?.items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ₹{item?.price?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{item.price * item.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="font-semibold text-lg">
              Total: ₹{invoiceData?.totalAmount?.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Send className="mr-2 h-4 w-4" /> Send Invoice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SeeInvoicePage;
