import React from "react";
import { Button } from "../ui/button";

const CTA = () => {
  return (
    <div className="bg-purple-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Streamline Your Billing?
        </h2>
        <p className="text-xl mb-8">Get started with our Simple Free Starter</p>
        <Button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started for Free
        </Button>
      </div>
    </div>
  );
};

export default CTA;
