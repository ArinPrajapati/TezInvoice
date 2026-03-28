"use client";
import React from "react";
import Header from "../nav/Header";
import useStore from "@/store/store";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/axios/service/authService";

const PUBLIC_ROUTES = ["/login", "/signup", "/"] as const;
type PublicRoute = (typeof PUBLIC_ROUTES)[number];

const Root = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setPath, setLogin, setPublicRoute, setLoginData } = useStore();
  const [authToken, setAuthToken] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  const pathname = usePathname();

  // Load authToken from localStorage only on client side
  React.useEffect(() => {
    setIsClient(true);
    setAuthToken(localStorage.getItem("authToken"));
  }, []);

  const isPublicRoute = (path: string): path is PublicRoute => {
    return PUBLIC_ROUTES.includes(path as PublicRoute);
  };

  const handleAuthError = () => {
    if (isClient) {
      localStorage.removeItem("authToken");
    }
    setLogin(false);
    router.push("/login");
  };

  React.useEffect(() => {
    // Only run authentication logic on client side
    if (!isClient) return;

    const authenticateUser = async () => {
      try {
        setPath(pathname);
        setPublicRoute(isPublicRoute(pathname));

        // Handle authenticated user on public routes
        if (authToken && authToken.length > 0 && isPublicRoute(pathname)) {
          router.push("/dashboard");
          return;
        }

        // Handle unauthenticated user on private routes
        if (!authToken && !isPublicRoute(pathname)) {
          router.push("/login");
          return;
        }

        // Validate authToken and fetch user data if authToken exists
        if (authToken && authToken.length > 0) {
          try {
            const userData = await AuthService.getCurrentUser();
            setLogin(true);
            setLoginData(userData);
          } catch (error) {
            handleAuthError();
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        handleAuthError();
      }
    };

    authenticateUser();
  }, [authToken, pathname, isClient]);

  return (
    <>
      {isPublicRoute(pathname) ? (
        <>
          {pathname === "/" && <Header />}
          <main className="min-h-screen">{children}</main>
        </>
      ) : (
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
      )}
    </>
  );
};

export default Root;
