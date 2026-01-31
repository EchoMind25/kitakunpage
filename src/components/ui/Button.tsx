"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "maroon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/30 border border-teal-500/20",
  secondary:
    "bg-white/5 hover:bg-white/10 text-white border border-white/10",
  ghost:
    "bg-transparent hover:bg-white/5 text-white/70 hover:text-white",
  maroon:
    "bg-maroon-700 hover:bg-maroon-600 text-white shadow-lg shadow-maroon-900/30 border border-maroon-600/20",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]
          disabled:opacity-40 disabled:cursor-not-allowed
          active:scale-[0.97]
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
