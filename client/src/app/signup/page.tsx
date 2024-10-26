"use client";
import React, { useState, useCallback } from "react";
import { AuthService } from "@/axios/service/authService";
import { Eye, EyeOff, Mail, Lock, User, Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";
interface User {
  name: string;
  email: string;
  serviceName: string;
  password: string;
}
export default function Signup() {
  const [formState, setFormState] = useState<User>({
    name: "",
    email: "",
    serviceName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<User>({
    name: "",
    email: "",
    serviceName: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Memoized change handler to prevent unnecessary re-renders
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    const newErrors: User = {
      name: "",
      email: "",
      serviceName: "",
      password: "",
    };
    if (!formState.name) newErrors.name = "Name is required";
    if (!formState.email) newErrors.email = "Email is required";
    if (!formState.serviceName)
      newErrors.serviceName = "Business name is required";
    if (!formState.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    // If there are errors, stop the submission
    if (Object.values(newErrors).some((error) => error)) {
      setIsLoading(false);
      return;
    }

    const { name, email, serviceName, password } = formState;

    try {
      const response = await AuthService.signup(
        email,
        password,
        name,
        serviceName
      );
      console.log("Signup response:", response);
      window.location.href = "/login";
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "error",
        description: (error as Error).message,
      });
    }


    console.log("Signup attempt:", formState);

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Join <span className="text-purple-600">TezInvoice</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start managing invoices
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Business Name Input */}
            <div>
              <label
                htmlFor="serviceName"
                className="block text-sm font-medium text-gray-700"
              >
                Business/Service Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  value={formState.serviceName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your business name"
                />
              </div>
              {errors.serviceName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.serviceName}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
                     shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                     transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <a
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
