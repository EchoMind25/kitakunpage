"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.02] border border-white/5 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
