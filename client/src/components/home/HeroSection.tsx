import React from "react";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Simplify Your Billing Process
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional invoicing software that helps freelancers and small
          businesses get paid faster
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Start Free Trial
          </Button>
          <Button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold border border-purple-600 hover:bg-blue-50 transition-colors">
            View Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
