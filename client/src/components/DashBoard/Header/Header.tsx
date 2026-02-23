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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, User, CreditCard, LogOut } from "lucide-react";
import { getInitials } from "@/lib/getInitials";
import useStore from "@/store/store";
import ProfileModal from "./modals/ProfileModal";
import BillingModal from "./modals/BillingModal";

export default function Header() {
  const { loginData } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);

  const getAccountLevelStyles = (level: string) => {
    switch (level) {
      case "Free":
        return "border-purple-200 text-purple-700 bg-purple-50";
      case "Professional":
        return "border-indigo-200 text-indigo-700 bg-indigo-50";
      case "Unlimited":
        return "border-green-200 text-green-700 bg-green-50";
      default:
        return "border-gray-200 text-gray-700 bg-gray-50";
    }
  };

  const MenuItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <Button
        variant="ghost"
        className={`justify-start ${isMobile ? "w-full" : ""
          } text-purple-700 hover:text-purple-900 hover:bg-purple-50`}
        onClick={() => setIsProfileOpen(true)}
      >
        <User className="mr-2 h-4 w-4" />
        Profile
      </Button>
      <Button
        variant="ghost"
        className={`justify-start ${isMobile ? "w-full" : ""
          } text-purple-700 hover:text-purple-900 hover:bg-purple-50`}
        onClick={() => setIsBillingOpen(true)}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Billing
      </Button>
      <Button
        variant="ghost"
        className={`justify-start ${isMobile ? "w-full" : ""
          } text-red-600 hover:text-red-700 hover:bg-red-50`}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </>
  );

  return (
    <header className="bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden text-white hover:bg-purple-600"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white">
                <SheetHeader>
                  <SheetTitle className="text-purple-700">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <MenuItems isMobile />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-white">TezInvoice</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Badge
              variant="secondary"
              className={`px-2 py-1 text-xs font-medium ${getAccountLevelStyles(
                loginData.accountLevel
              )}`}
            >
              {loginData.accountLevel}
            </Badge>

            <Badge
              variant="secondary"
              className="px-2 py-1 text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            >
              Invoices: {2}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-purple-600"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8 font-bold bg-purple-200 text-purple-700 flex items-center justify-center">
                    {getInitials(loginData.name)}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-purple-700">
                      {loginData.name}
                    </p>
                    <p className="text-xs leading-none text-purple-500">
                      {loginData.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <MenuItems />
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
}
