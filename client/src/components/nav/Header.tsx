import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="bg-purple-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight">
              Tez<span className="text-purple-300">Invoice</span>
            </span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href={"/login"}>
              <Button className="px-4 py-2 text-purple-100 hover:text-white transition-colors">
                Login
              </Button>
            </Link>
            <Link href={"/signup"}>
              <Button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
