import React from "react";
import {
  CreditCard,
  BarChart3,
  Clock,
  Globe,
  Shield,
  DollarSign,
} from "lucide-react";
const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const features = [
  {
    icon: CreditCard,
    title: "Easy Invoice Creation",
    description:
      "Create professional invoices in minutes with customizable templates and branding options.",
  },
  {
    icon: Clock,
    title: "Recurring Billing",
    description:
      "Automate your billing process with scheduled recurring invoices for retainer clients.",
  },
  {
    icon: BarChart3,
    title: "Payment Tracking",
    description:
      "Monitor payment status and send automatic reminders for overdue invoices.",
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description:
      "Handle international clients with built-in currency conversion and tax management.",
  },
  {
    icon: Shield,
    title: "Secure Client Portal",
    description:
      "Provide clients with a secure portal to view and pay invoices online.",
  },
  {
    icon: DollarSign,
    title: "Financial Reports",
    description:
      "Generate detailed financial reports for better business insights and tax compliance.",
  },
];

const FeatureSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Everything You Need to Manage Billing
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
