"use client";
import SeeInvoicePage from "@/components/DashBoard/InvoiceSummary/SeeInvoicePage";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const id = usePathname().split("/")[2];
  useEffect(() => {
    if (!id) {
      alert("Invoice ID not found");
    }
    /// Fetch invoice data from API
  }, []);
  const invoiceData = {
    id: id,
    client: "Acme Corp",
    date: new Date(2023, 6, 15),
    dueDate: new Date(2023, 7, 15),
    status: "Unpaid",
    items: [
      {
        description: "Web Development",
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
      },
      { description: "UI/UX Design", quantity: 2, unitPrice: 500, total: 1000 },
      {
        description: "Content Creation",
        quantity: 5,
        unitPrice: 100,
        total: 500,
      },
    ],
    subtotal: 2500,
    tax: 250,
    total: 2750,
  };

  return <SeeInvoicePage invoiceData={invoiceData} />;
};
export default page;
