"use client";
import React from "react";
import Header from "../nav/Header";
import useStore from "@/store/store";
import { redirect, usePathname } from "next/navigation";

const Root = ({ children }: { children: React.ReactNode }) => {
  const { path, setPath, login, token, setLogin } = useStore();
  const pathname = usePathname();

  React.useEffect(() => {
    setPath(pathname);
    if (token.length > 0) {
      // set logic and hit api to check if token is valid
      // get it data from it and add it loginData State
      // setLogin(true);
    }
    if (
      !login &&
      pathname !== "/login" &&
      pathname !== "/signup" &&
      pathname !== "/"
    ) {
      setPath("/login");
      redirect("/login");
    }
  }, [pathname]);

  const shouldShowHeader = pathname !== "/login" && pathname !== "/signup";

  return (
    <main>
      {shouldShowHeader && <Header />}
      {children}
    </main>
  );
};

export default Root;
