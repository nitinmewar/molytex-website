import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";

vi.mock("@/lib/actions/submitInquiry", () => ({ submitInquiry: vi.fn() }));

import { ContactDialog, openContact } from "@/components/contact/ContactDialog";
import { CtaBand } from "@/components/home/CtaBand";

beforeAll(() => {
  // jsdom has no modal implementation; mirror the open attribute the browser would set.
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});

describe("ContactDialog", () => {
  afterEach(cleanup);

  it("opens with the email prefilled and closes again", () => {
    render(<ContactDialog />);
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).not.toHaveAttribute("open");

    act(() => openContact("asha@hospital.in"));
    expect(dialog).toHaveAttribute("open");
    expect(screen.getByLabelText(/^email/i)).toHaveValue("asha@hospital.in");

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("CTA strip hands its email to the dialog instead of navigating", () => {
    render(<><CtaBand /><ContactDialog /></>);
    fireEvent.change(screen.getByLabelText("Your email address"), { target: { value: "x@clinic.in" } });
    fireEvent.click(screen.getByRole("button", { name: /get in touch/i }));

    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("open");
    expect(screen.getByLabelText(/^email/i)).toHaveValue("x@clinic.in");
  });
});
