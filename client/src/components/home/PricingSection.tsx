import { Check } from "lucide-react";

import React from "react";
interface PricingPlan {
  title: string;
  price: string;
  duration: string;
  features: string[];
  cta: string;
  popular: boolean;
}
const pricingPlans = [
  {
    title: "Free Starter",
    price: "0",
    duration: "/month",
    features: [
      "5 free invoices per month",
      "Basic Invoice templates",
      "Email support",
      "Secure client portal",
      "Payment tracking",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    title: "Professional",
    price: "500",
    duration: "/month",
    features: [
      "50 invoices per month",
      "Custom templates",
      "Priority support",
      "Custom branding",
      "Multiple payment gateways",
      "Recurring invoices",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    title: "Unlimited",
    price: "1,000",
    duration: "/month",
    features: [
      "Unlimited invoices",
      "Custom templates",
      "Priority support",
      "Custom branding",
      "Multiple payment gateways",
      "Recurring invoices",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];
const PricingCard = ({
  title,
  price,
  duration,
  features,
  popular,
  cta,
}: PricingPlan) => (
  <div
    className={`p-8 rounded-lg ${
      popular
        ? "border-2 border-blue-600 relative bg-white shadow-lg"
        : "border border-gray-200 bg-white shadow"
    }`}
  >
    {popular && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-4xl font-bold">₹{price}</span>
      <span className="text-gray-600">{duration}</span>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
        popular
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
      }`}
    >
      {cta}
    </button>
  </div>
);

const PricingSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600">
            Choose the plan that works best for your business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need more than your free monthly invoices?
          </p>
          <p className="text-lg font-semibold">
            Pay just ₹60 per additional invoice
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
