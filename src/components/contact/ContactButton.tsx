"use client";

import type { ComponentPropsWithoutRef } from "react";
import { openContact } from "./ContactDialog";

/** A plain button that opens the contact popup; style it with className. */
export function ContactButton({ onClick, ...props }: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        openContact();
      }}
    />
  );
}
