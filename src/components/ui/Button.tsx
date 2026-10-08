import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "green" | "ghost" | "white" | "outline-white";
type Size = "default" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue text-white hover:shadow-blue",
  green: "bg-green text-[#0c2a00] hover:shadow-[0_14px_30px_rgba(106,191,31,0.3)]",
  ghost: "bg-transparent text-blue border-line-2 hover:bg-white hover:border-blue hover:shadow-sm",
  white: "bg-white text-blue hover:shadow-[0_14px_30px_rgba(0,0,0,0.18)]",
  "outline-white": "bg-transparent text-white border-white/45 hover:bg-white/12 hover:border-white hover:shadow-none",
};

const sizeClasses: Record<Size, string> = {
  default: "px-[1.6em] py-[0.95em] text-[0.97rem]",
  lg: "px-[1.9em] py-[1.1em] text-[1.02rem]",
};

const base =
  "inline-flex items-center justify-center gap-[0.6em] font-body font-bold tracking-[0.01em] rounded-full border-[1.5px] border-transparent whitespace-nowrap transition-all duration-250 hover:-translate-y-0.5 [&_svg]:h-[1.05em] [&_svg]:w-[1.05em] [&_svg]:transition-transform [&_svg]:duration-250 [&:hover_svg]:translate-x-[3px]";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">)
  | ({ href?: never } & ComponentPropsWithoutRef<"button">)
);

export function buttonClass(variant: Variant = "primary", size: Size = "default", block = false, className = "") {
  return `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${block ? "w-full" : ""} ${className}`;
}

export function Button({
  variant = "primary",
  size = "default",
  block,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const cls = buttonClass(variant, size, block, className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props as { href: string } & Record<string, unknown>;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...(props as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}

export function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
