"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FileQuestion, Search, Users } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// const mockClients: Client[] = [
//   {
//     id: 1,
//     name: "Acme Corp",
//     email: "contact@acme.com",
//     phone: "123-456-7890",
//   },
//   {
//     id: 2,
//     name: "Globex Corporation",
//     email: "info@globex.com",
//     phone: "098-765-4321",
//   },
//   {
//     id: 3,
//     name: "Initech",
//     email: "support@initech.com",
//     phone: "555-123-4567",
//   },
//   {
//     id: 4,
//     name: "Umbrella Corporation",
//     email: "info@umbrella.com",
//     phone: "777-888-9999",
//   },
//   {
//     id: 5,
//     name: "Hooli",
//     email: "contact@hooli.com",
//     phone: "111-222-3333",
//   },
// ];

const mockClients: Client[] = [];
const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <FileQuestion className="h-12 w-12 text-purple-200 mb-4" />
    <h3 className="text-lg font-semibold text-purple-900 mb-2">
      {searchTerm
        ? "No clients found matching your search"
        : "No clients available"}
    </h3>
    <p className="text-sm text-purple-600 text-center max-w-sm">
      {searchTerm
        ? `Try adjusting your search term or checking for typos.`
        : "Start by adding your first client to the system."}
    </p>
  </div>
);

const SeeAllClientsModal = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-600 text-purple-700 hover:bg-purple-100 flex items-center justify-center h-12 rounded-md shadow-sm transition duration-200"
        >
          <Users className="mr-2 h-5 w-5" />
          See All Clients
          {mockClients.length > 0 && (
            <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
              {mockClients.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Clients</DialogTitle>
          <DialogDescription>
            Here's a list of all your clients. Use the search box to filter the
            results.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          {filteredClients.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Name</TableHead>
                    <TableHead className="w-[35%]">Email</TableHead>
                    <TableHead className="w-[25%]">Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-purple-50 cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${client.email}`}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {client.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`tel:${client.phone}`}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {client.phone}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}
          {filteredClients.length > 0 && (
            <div className="text-sm text-gray-500 text-center">
              Showing {filteredClients.length} of {mockClients.length} clients
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeeAllClientsModal;
