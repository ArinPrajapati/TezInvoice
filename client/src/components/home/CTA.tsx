import React from "react";

const CTA = () => {
  return (
    <div className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Streamline Your Billing?
        </h2>
        <p className="text-xl mb-8">
          Get started with our free trial and unlock all features.
        </p>
        <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started for Free
        </button>
      </div>
    </div>
  );
};

export default CTA;
