"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer";

  const variantClasses = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700",
    ghost: "text-gray-300 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} flex items-center gap-2`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      {loading ? "Loading..." : children}
    </button>
  );
}
