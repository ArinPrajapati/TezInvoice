"use client";
import { InvoiceService } from "@/axios/service/invoiceService";
import SeeInvoicePage from "@/components/DashBoard/InvoiceSummary/SeeInvoicePage";
import { Invoice } from "@/types/invoice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const id = usePathname().split("/")[2];
  useEffect(() => {
    if (!id) {
      alert("Invoice ID not found");
    }
    /// Fetch invoice data from API
  }, []);
  const [invoiceData, setInvoiceData] = useState<Invoice>({} as Invoice);
  useEffect(() => {
    const fetchInvoice = async () => {
      const response = await InvoiceService.getInvoiceById(id);
      setInvoiceData(response.data);
    };
    fetchInvoice();
  }, [id]);
  return <SeeInvoicePage invoiceData={invoiceData} />;
};
export default Page;
