import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { getInitials } from "@/lib/getInitials";

type AccountLevel = "Free" | "Professional" | "Unlimited";

interface HeaderProps {
  accountLevel: AccountLevel;
}

const Header: React.FC<HeaderProps> = ({ accountLevel }) => {
  return (
    <header className="bg-purple-50 shadow-md rounded-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-800">Dashboard</h1>
        <div className="flex items-center space-x-4 ">
          <Badge
            variant="outline"
            className={`
              border-2
              w-30 h-10
              ${
                accountLevel === "Free"
                  ? "border-purple-500 text-purple-700"
                  : ""
              }
              ${
                accountLevel === "Professional"
                  ? "border-indigo-500 text-indigo-700"
                  : ""
              }
              ${
                accountLevel === "Unlimited"
                  ? "border-green-500 text-green-700"
                  : ""
              }
            `}
          >
            {accountLevel}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-purple-600 hover:bg-purple-500 text-black font-bold text-[1.1rem] text-center"
              >
                {getInitials("John Doe")}
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
