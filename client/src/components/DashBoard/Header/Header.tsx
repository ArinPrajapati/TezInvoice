"use client";

import React, { useState } from "react";
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
import { getInitials } from "@/lib/getInitials";
import useStore from "@/store/store";
import ProfileModal from "./modals/ProfileModal";
import BillingModal from "./modals/BillingModal";

const Header: React.FC = () => {
  const { loginData } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);

  const getAccountLevelStyles = (level: string) => {
    switch (level) {
      case "Free":
        return "border-purple-400 text-purple-700 bg-purple-50";
      case "Professional":
        return "border-indigo-400 text-indigo-700 bg-indigo-50";
      case "Unlimited":
        return "border-green-400 text-green-700 bg-green-50";
      default:
        return "border-gray-400 text-gray-700 bg-gray-50";
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <Badge
              variant="outline"
              className={`
                px-4 py-2
                border-2
                font-medium
                transition-all
                duration-200
                ${getAccountLevelStyles(loginData.accountLevel)}
              `}
            >
              {loginData.accountLevel}
            </Badge>

            <Badge
              variant="secondary"
              className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            >
              Invoices: {2}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="
                    w-10 h-10
                    rounded-full 
                    bg-white/10 
                    hover:bg-white/20 
                    text-white 
                    font-semibold 
                    text-lg
                    transition-colors
                    duration-200
                    focus:ring-2
                    focus:ring-purple-400
                    focus:ring-offset-2
                    focus:ring-offset-purple-900
                  "
                >
                  {getInitials(loginData.name)}
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <DropdownMenuLabel className="text-gray-700 font-medium px-4 py-2">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  onSelect={() => setIsProfileOpen(true)}
                  className="text-gray-600 hover:text-purple-700 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-700"
                >
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setIsBillingOpen(true)}
                  className="text-gray-600 hover:text-purple-700 hover:bg-purple-50 focus:bg-purple-50 focus:text-purple-700"
                >
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <BillingModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
      />
    </header>
  );
};

export default Header;
