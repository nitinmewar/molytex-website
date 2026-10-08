import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
};

export function Card({ children, className = "", hoverable }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-line bg-white shadow-sm transition-all duration-350 ${
        hoverable
          ? "hover:-translate-y-1.5 hover:border-blue-tint-2 hover:shadow-lg"
          : ""
      } ${className}`}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {children}
    </div>
  );
}
