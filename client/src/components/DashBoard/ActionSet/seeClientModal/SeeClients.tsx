"use client";

import React, { useEffect, useState } from "react";
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
import {
  FileQuestion,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ClientService } from "@/axios/service/clientService";

interface Client {
  _id: number;    
  name: string;
  email: string;
  phoneNumber: string;
}

const ITEMS_PER_PAGE = 3;

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

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
    <div className="flex flex-1 justify-between sm:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  </div>
);

const SeeAllClientsModal = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedClients = await ClientService.getClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError("Failed to load clients. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchClients();

    // Subscribe to client updates
    const unsubscribe = ClientService.subscribe((updatedClients) => {
      setClients(updatedClients);
    });

    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      client?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      client?.phoneNumber?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          {clients.length > 0 && (
            <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
              {clients.length}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : filteredClients.length > 0 ? (
            <>
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
                    {paginatedClients.map((client) => (
                      <TableRow
                        key={client._id}
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
                            href={`tel:${client.phoneNumber}`}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            {client.phoneNumber}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-sm text-gray-500 text-center">
                Showing {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredClients.length)}{" "}
                of {filteredClients.length} clients
              </div>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeeAllClientsModal;
