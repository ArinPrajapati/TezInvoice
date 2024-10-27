"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nanoid } from "nanoid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { InvoiceService } from "@/axios/service/invoiceService";
import { ClientService } from "@/axios/service/clientService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Client {
  id: string;
  name: string;
}

interface CreateInvoiceData {
  clientId: string;
  invoiceNumber: string;
  jobDescription: string;
  items: InvoiceItem[];
  createdAt: Date;
  dueDate: Date;
  notes: string;
  paymentMethod: string;
  totalAmount: number;
}

const CreateInvoice = () => {
  const router = useRouter();
  const { toast } = useToast();

  // Form states
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${nanoid(6).toUpperCase()}`
  );
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const fetchedClients = await ClientService.getClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!selectedClient) errors.client = "Please select a client";
    if (!invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";
    if (!jobDescription.trim())
      errors.jobDescription = "Job description is required";
    if (!paymentMethod) errors.paymentMethod = "Please select a payment method";

    // Validate items
    if (items.length === 0) {
      errors.items = "At least one item is required";
    } else {
      items.forEach((item, index) => {
        if (!item.description.trim()) {
          errors[`item-${index}-description`] = "Description is required";
        }
        if (item.quantity <= 0) {
          errors[`item-${index}-quantity`] = "Quantity must be greater than 0";
        }
        if (item.unitPrice <= 0) {
          errors[`item-${index}-price`] = "Price must be greater than 0";
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "description" ? value : Number(value),
    };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const invoiceData: CreateInvoiceData = {
      clientId: selectedClient,
      invoiceNumber,
      jobDescription,
      items,
      createdAt: invoiceDate,
      dueDate,
      notes,
      paymentMethod,
      totalAmount: calculateTotal(),
    };

    try {
      setIsSubmitting(true);
      await InvoiceService.createInvoice(invoiceData);

      toast({
        title: "Success",
        description: "Invoice created successfully!",
      });

      router.push("/invoices"); // Redirect to invoices list
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6 space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <h1 className="text-2xl font-bold text-purple-800">
          Create New Invoice
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="client">Client</Label>
            <Select
              value={selectedClient}
              onValueChange={setSelectedClient}
              disabled={isLoading}
            >
              <SelectTrigger
                id="client"
                className={formErrors.client ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value=" ">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </SelectItem>
                ) : (
                  clients &&
                  clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formErrors.client && (
              <p className="text-sm text-red-500 mt-1">{formErrors.client}</p>
            )}
          </div>
          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              placeholder="INV-001"
              value={invoiceNumber}
              disabled={true}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className={formErrors.invoiceNumber ? "border-red-500" : ""}
            />
            {formErrors.invoiceNumber && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.invoiceNumber}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2">
            <Label>Job Description</Label>
            <Input
              placeholder="Job description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className={formErrors.jobDescription ? "border-red-500" : ""}
            />
            {formErrors.jobDescription && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.jobDescription}
              </p>
            )}
          </div>

          <Label>Items</Label>
          {items.map((item, index) => (
            <div key={index} className="flex items-end space-x-2 mb-2">
              <div className="flex-grow">
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className={
                    formErrors[`item-${index}-description`]
                      ? "border-red-500"
                      : ""
                  }
                />
                {formErrors[`item-${index}-description`] && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors[`item-${index}-description`]}
                  </p>
                )}
              </div>
              <div className="w-20">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                  className={
                    formErrors[`item-${index}-quantity`] ? "border-red-500" : ""
                  }
                />
                {formErrors[`item-${index}-quantity`] && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors[`item-${index}-quantity`]}
                  </p>
                )}
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, "unitPrice", e.target.value)
                  }
                  className={
                    formErrors[`item-${index}-price`] ? "border-red-500" : ""
                  }
                />
                {formErrors[`item-${index}-price`] && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors[`item-${index}-price`]}
                  </p>
                )}
              </div>
              <div className="w-24">
                <Input
                  readOnly
                  value={(item.quantity * item.unitPrice).toFixed(2)}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Invoice Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceDate ? (
                    format(invoiceDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={invoiceDate}
                  onSelect={(date) => setInvoiceDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => setDueDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes or terms..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger
              id="paymentMethod"
              className={formErrors.paymentMethod ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Razor Pay</SelectItem>
              <SelectItem value="banktransfer">Offline</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.paymentMethod && (
            <p className="text-sm text-red-500 mt-1">
              {formErrors.paymentMethod}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            Total Amount: ${calculateTotal().toFixed(2)}
          </div>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Generate Invoice"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
