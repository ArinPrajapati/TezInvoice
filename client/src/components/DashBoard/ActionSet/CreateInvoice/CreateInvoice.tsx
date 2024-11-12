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
import { currencySymbols, getCurrencySymbol } from "@/lib/moneySymbols";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  address?: string;
  currency?: string;
}

interface CreateInvoiceData {
  clientInfo: {
    name: string;
    email: string;
    currency: string;
  };
  invoiceNumber: string;
  jobDescription: string;
  items: InvoiceItem[];
  createdAt: Date;
  dueDate: Date;
  notes: string;
  paymentMethod: string;
  paymentLink?: string;
  currency: string;
  totalAmount: number;
}

const CreateInvoice = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, price: 0, subtotal: 0 },
  ]);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client>({} as Client);
  const [currency, setCurrency] = useState("INR");
  const [paymentLink, setPaymentLink] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${nanoid(6).toUpperCase()}`
  );
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [clientsError, setClientsError] = useState<string>("");

  useEffect(() => {
    if (selectedClient) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.client;
        return newErrors;
      });
    }
  }, [selectedClient]);

  const handleClientChange = (value: string) => {
    const filteredClient = clients.find((client) => client._id === value);
    setSelectedClient({
      _id: filteredClient?._id || "",
      name: filteredClient?.name || "",
      email: filteredClient?.email || "",
    });
    if (value) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.client;
        return newErrors;
      });
    }
  };

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

    if (!selectedClient.name) errors.client = "Please select a client";
    if (!invoiceNumber.trim())
      errors.invoiceNumber = "Invoice number is required";
    if (!jobDescription.trim())
      errors.jobDescription = "Job description is required";
    if (!paymentMethod) errors.paymentMethod = "Please select a payment method";
    if (!currency) errors.currency = "Please select a currency";
    if (paymentMethod === "online" && !paymentLink.trim()) {
      errors.paymentLink = "Payment link is required for online payments";
    }

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
        if (item.price <= 0) {
          errors[`item-${index}-price`] = "Price must be greater than 0";
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, price: 0, subtotal: 0 },
    ]);
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
    console.log(field, value);
    const newItems = [...items];

    // Convert `value` to a number only if it's `quantity` or `price`
    const updatedValue =
      field === "quantity" || field === "price" ? Number(value) : value;

    // Update the item
    newItems[index] = {
      ...newItems[index],
      [field]: field === "description" ? value : Number(value),
      [field]: updatedValue,
      subtotal:
        field === "quantity" || field === "price"
          ? (field === "quantity"
              ? Number(updatedValue)
              : newItems[index].quantity) *
            (field === "price" ? Number(updatedValue) : newItems[index].price)
          : newItems[index].quantity * newItems[index].price,
    };

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.subtotal, 0);
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
      clientInfo: {
        name: selectedClient.name,
        email: selectedClient.email,
        currency: selectedClient.currency || currency,
      },
      invoiceNumber,
      jobDescription,
      items: items.map((item) => ({
        ...item,
        subtotal: item.quantity * item.price,
      })),
      createdAt: invoiceDate,
      dueDate,
      notes,
      paymentMethod,
      paymentLink: paymentMethod === "online" ? paymentLink : undefined,
      currency,
      totalAmount: calculateTotal(),
    };

    try {
      setIsSubmitting(true);
      await InvoiceService.createInvoice(invoiceData);

      toast({
        title: "Success",
        description: "Invoice created successfully!",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: `Failed to create invoice.${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
            <Label htmlFor="client">Client *</Label>
            <Select
              value={selectedClient?._id || ""}
              onValueChange={handleClientChange}
              disabled={isLoading}
            >
              <SelectTrigger
                id="client"
                className={`${
                  formErrors.client || clientsError ? "border-red-500" : ""
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value=" ">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading clients...</span>
                    </div>
                  </SelectItem>
                ) : clientsError ? (
                  <SelectItem value=" ">
                    <span className="text-red-500">{clientsError}</span>
                  </SelectItem>
                ) : clients.length === 0 ? (
                  <SelectItem value=" ">No clients available</SelectItem>
                ) : (
                  clients.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formErrors.client && (
              <p className="text-sm text-red-500 mt-1">{formErrors.client}</p>
            )}
            {clientsError && (
              <p className="text-sm text-red-500 mt-1">{clientsError}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="currency">Currency *</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger
                id="currency"
                className={formErrors.currency ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencySymbols).map(([code, symbol]) => (
                  <SelectItem key={code} value={code}>
                    {code} ({symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.currency && (
              <p className="text-sm text-red-500 mt-1">{formErrors.currency}</p>
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
                  min={1}
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
                  value={item.price}
                  min={0}
                  onChange={(e) => updateItem(index, "price", e.target.value)}
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
                  value={item.subtotal.toFixed(2)}
                  onChange={(e) =>
                    updateItem(index, "subtotal", e.target.value)
                  }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger
                id="paymentMethod"
                className={formErrors.paymentMethod ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Razor Pay</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.paymentMethod && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.paymentMethod}
              </p>
            )}
          </div>

          {paymentMethod === "online" && (
            <div>
              <Label htmlFor="paymentLink">Payment Link *</Label>
              <Input
                id="paymentLink"
                placeholder="Enter Razor Pay payment link"
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                className={formErrors.paymentLink ? "border-red-500" : ""}
              />
              {formErrors.paymentLink && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.paymentLink}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            Total Amount: {getCurrencySymbol(currency)}
            {calculateTotal().toFixed(2)}
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
