import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, FileText, FileSignature } from "lucide-react";
import Link from "next/link";
import AddClientModal from "./addClientModal/ClientModal";
import SeeAllClientsModal from "./seeClientModal/SeeClients";
import SeeAllInvoicesModal from "./SeeAllInvoicesModal/SeeAllInvoicesModal";

const ActionSet = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">
        Quick Actions
      </h2>
      {/* Responsive grid for buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={"/create/invoice"}>
          <Button
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center h-12 rounded-md shadow-sm transition duration-200 w-full"
          >
            <FileSignature className="mr-2 h-5 w-5" />
            Create New Invoice
          </Button>
        </Link>
        <AddClientModal />
        <SeeAllClientsModal />
        <SeeAllInvoicesModal />
      </div>
    </div>
  );
};

export default ActionSet;
