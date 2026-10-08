import type { ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  small?: boolean;
  grey?: boolean;
  id?: string;
};

export function SectionWrapper({
  children,
  className = "",
  small,
  grey,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative ${
        small
          ? "py-[clamp(48px,5vw,80px)]"
          : "py-[clamp(64px,8vw,120px)]"
      } ${grey ? "bg-bg" : ""} ${className}`}
    >
      <div className="mx-auto max-w-[var(--maxw)] px-[var(--gutter)]">
        {children}
      </div>
    </section>
  );
}
