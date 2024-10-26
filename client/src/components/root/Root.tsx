"use client";
import React from "react";
import Header from "../nav/Header";
import useStore from "@/store/store";
import { redirect, usePathname } from "next/navigation";

const Root = ({ children }: { children: React.ReactNode }) => {
  const { path, setPath, login, token, setLogin, publicRoute, setPublicRoute } =
    useStore();
  const pathname = usePathname();
  const [publicRoutes, setPublicRoutes] = React.useState<string[]>([
    "/login",
    "/signup",
    "/",
  ]);

  React.useEffect(() => {
    setPath(pathname);
    if (publicRoutes.includes(pathname)) {
      setPublicRoute(true);
    } else {
      setPublicRoute(false);
    }
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

    if (
      login &&
      (pathname === "/login" || pathname === "/signup" || pathname === "/")
    ) {
      redirect("/dashboard");
    }
  }, [pathname]);

  const shouldShowHeader = pathname !== "/login" && pathname !== "/signup";

  return (
    <>
      {publicRoute ? (
        <>
          {shouldShowHeader && <Header />}
          <main>{children}</main>
        </>
      ) : (
        <div className="">
          <main>{children}</main>
        </div>
      )}
    </>
  );
};

export default Root;
