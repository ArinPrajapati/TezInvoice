"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/store/store";
import { toast } from "@/hooks/use-toast";
import { Plus, CreditCard, Package, Receipt, CheckCircle2 } from "lucide-react";

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["5 invoices/month", "Basic templates", "Email support"],
    recommended: false,
  },
  {
    name: "Professional",
    price: "$29",
    features: [
      "50 invoices/month",
      "Premium templates",
      "Priority support",
      "Custom branding",
    ],
    recommended: true,
  },
  {
    name: "Unlimited",
    price: "$99",
    features: [
      "Unlimited invoices",
      "All premium features",
      "24/7 support",
      "API access",
      "Team collaboration",
    ],
    recommended: false,
  },
];

const BillingModal: React.FC<BillingModalProps> = ({ isOpen, onClose }) => {
  const { loginData } = useStore();
  const [invoicesToBuy, setInvoicesToBuy] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(loginData.accountLevel);

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    toast({
      title: "Plan Updated",
      description: `Your plan has been updated to ${plan}`,
      variant: "default",
      className: "bg-green-500 text-white",
    });
  };

  const handleBuyInvoices = () => {
    toast({
      title: "Invoices Purchased",
      description: `Successfully purchased ${invoicesToBuy} additional invoices`,
      variant: "default",
      className: "bg-green-500 text-white",
    });
    setInvoicesToBuy(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-purple-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Billing & Subscription
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Manage your plan and invoice purchases
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-6">
            {/* Current Plan Status */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Current Subscription
                  </h3>
                  <p className="text-sm text-purple-700">
                    Your active plan and usage
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`
                    px-3 py-1
                    border-2
                    font-medium
                    ${
                      loginData.accountLevel === "Free"
                        ? "border-purple-400 text-purple-700 bg-purple-50"
                        : loginData.accountLevel === "Professional"
                        ? "border-indigo-400 text-indigo-700 bg-indigo-50"
                        : "border-green-400 text-green-700 bg-green-50"
                    }
                  `}
                >
                  {loginData.accountLevel} Plan
                </Badge>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`
                      relative rounded-lg border-2 p-4 cursor-pointer
                      ${
                        selectedPlan === plan.name
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }
                      ${
                        plan.recommended
                          ? "ring-2 ring-purple-500 ring-offset-2"
                          : ""
                      }
                    `}
                    onClick={() => handlePlanChange(plan.name)}
                  >
                    {plan.recommended && (
                      <Badge className="absolute -top-2 -right-2 bg-purple-500">
                        Recommended
                      </Badge>
                    )}
                    <div className="font-semibold text-lg mb-2">
                      {plan.name}
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      {plan.price}
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Invoices */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-600" />
                Additional Invoices
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      Remaining Invoices
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      23
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      type="number"
                      value={invoicesToBuy}
                      onChange={(e) =>
                        setInvoicesToBuy(
                          Math.max(1, parseInt(e.target.value, 10))
                        )
                      }
                      className="w-20"
                      min="1"
                    />
                    <Button
                      onClick={handleBuyInvoices}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Buy More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t px-6 py-4">
          <DialogFooter>
            <Button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingModal;
