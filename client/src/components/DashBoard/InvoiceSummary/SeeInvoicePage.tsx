import React from "react";
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

const SeeInvoicePage = ({ invoiceData }: any) => {
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
                Invoice {invoiceData.id}
              </CardTitle>
              <CardDescription>
                Issued on {invoiceData.date.toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge
              variant={
                invoiceData.status === "Paid" ? "default" : "destructive"
              }
            >
              {invoiceData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-semibold mb-1">Billed To:</h3>
              <p>{invoiceData.client}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-1">Due Date:</h3>
              <p>{invoiceData.dueDate.toLocaleDateString()}</p>
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
              {invoiceData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${item.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="mb-1">Subtotal: ${invoiceData.subtotal.toFixed(2)}</p>
            <p className="mb-1">Tax: ${invoiceData.tax.toFixed(2)}</p>
            <p className="font-semibold text-lg">
              Total: ${invoiceData.total.toFixed(2)}
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
