import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  variant?: "blue" | "green";
  className?: string;
};

export function Tag({ children, variant = "blue", className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.78rem] font-bold ${
        variant === "green"
          ? "bg-green-tint text-green-700"
          : "bg-blue-tint text-blue"
      } ${className}`}
    >
      {children}
    </span>
  );
}
