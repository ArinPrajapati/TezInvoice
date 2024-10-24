"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Briefcase } from "lucide-react";
import { z } from "zod";

// Zod schema for form validation
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  serviceName: z.string().min(1, "Business name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Define types for form data and errors
type FormData = {
  name: string;
  email: string;
  password: string;
  serviceName: string;
};

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  serviceName?: string;
  general?: string;
};

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    serviceName: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name as keyof Errors]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form data using Zod
      const validatedData = signupSchema.parse(formData);
      setIsLoading(true);

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Handle successful signup
      console.log("Signup successful:", data);
      // Add your redirect logic here
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors into a simpler format
        const formattedErrors: Errors = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0] as keyof Errors] = err.message;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ general: (error as Error).message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const InputField: React.FC<{
    name: keyof FormData;
    label: string;
    type?: string;
    icon: React.ElementType;
    placeholder: string;
  }> = ({ name, label, type = "text", icon: Icon, placeholder }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={name}
          name={name}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={formData[name]}
          onChange={handleChange}
          className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
            errors[name] ? "border-red-300" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          placeholder={placeholder}
        />
        {type === "password" && (
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
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Join <span className="text-purple-600">TezInvoice</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start managing invoices
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              name="name"
              label="Full Name"
              icon={User}
              placeholder="Enter your full name"
            />
            <InputField
              name="email"
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
            />
            <InputField
              name="serviceName"
              label="Business/Service Name"
              icon={Briefcase}
              placeholder="Enter your business name"
            />
            <InputField
              name="password"
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Create a password"
            />
          </div>

          {/* Submit Button */}
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

          {/* Sign In Link */}
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
