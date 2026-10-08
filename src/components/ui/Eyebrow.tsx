import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  dark?: boolean;
  center?: boolean;
};

export function Eyebrow({ children, dark, center }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-[0.55em] font-body text-[0.78rem] font-bold uppercase tracking-[0.16em] before:h-0.5 before:w-[26px] before:rounded-full before:bg-green ${
        dark ? "text-[#9CC9FF]" : "text-blue"
      } ${center ? "justify-center" : ""}`}
    >
      {children}
    </span>
  );
}
