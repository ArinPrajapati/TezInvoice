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
import { Search, Users } from "lucide-react";

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Globex Corporation",
    email: "info@globex.com",
    phone: "098-765-4321",
  },
  {
    id: 3,
    name: "Initech",
    email: "support@initech.com",
    phone: "555-123-4567",
  },
  {
    id: 4,
    name: "Umbrella Corporation",
    email: "info@umbrella.com",
    phone: "777-888-9999",
  },
  { id: 5, name: "Hooli", email: "contact@hooli.com", phone: "111-222-3333" },
];

const SeeAllClientsModal = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-600 text-purple-700 hover:bg-purple-100 flex items-center justify-center h-12 rounded-md shadow-sm transition duration-200"
        >
          <Users className="mr-2 h-5 w-5" />
          See All Clients
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>All Clients</DialogTitle>
          <DialogDescription>
            Here's a list of all your clients. Use the search box to filter the
            results.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default SeeAllClientsModal;
