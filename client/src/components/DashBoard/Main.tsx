import React from "react";
import InvoiceSummary from "./InvoiceSummary/InvoiceSummary";
import UnPaidTable from "./UnPaidTable/UnPaidTable";
import ActionSet from "./ActionSet/ActionSet";
import Header from "./Header/Header";

const Main = () => {
  return (
    <div className="min-h-screen bg-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          <Header accountLevel="Professional" />
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ActionSet />
              <InvoiceSummary />
            </div>
          </div>
          <div className="lg:col-span-1">
            <UnPaidTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
