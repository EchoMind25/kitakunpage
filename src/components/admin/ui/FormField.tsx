"use client";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  description?: string;
}

export function FormField({ label, error, children, description }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">
        {label}
      </label>
      {description && (
        <p className="text-xs text-white/30">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
