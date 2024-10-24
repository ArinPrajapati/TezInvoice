import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Features</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600">
              <li>About</li>
              <li>Customers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Documentation</li>
              <li>Support</li>
              <li>Status</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
              <li>Compliance</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          © 2024 Invoice Software. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
