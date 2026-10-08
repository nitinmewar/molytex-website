import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

const sendInquiry = vi.fn();
vi.mock("@/lib/sendInquiry", () => ({ sendInquiry: (fd: FormData) => sendInquiry(fd) }));

import { ConsultationForm } from "@/components/home/ConsultationForm";

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe("ConsultationForm", () => {
  beforeEach(() => sendInquiry.mockReset());
  afterEach(cleanup);

  it("sends the fields the inquiry action expects and confirms success", async () => {
    sendInquiry.mockResolvedValue({ success: true });
    render(<ConsultationForm />);
    fill("Your name", "Asha Rao");
    fill("Email address", "asha@hospital.in");
    fill("Phone number", "+91 98765 43210");
    fill("Company Name", "City Hospital");
    fill("Your message", "Need surgical consumables");
    fireEvent.click(screen.getByRole("button", { name: /schedule a free consultation/i }));

    await waitFor(() => expect(sendInquiry).toHaveBeenCalledOnce());
    const fd: FormData = sendInquiry.mock.calls[0][0];
    expect(fd.get("name")).toBe("Asha Rao");
    expect(fd.get("organization")).toBe("City Hospital");
    expect(fd.get("email")).toBe("asha@hospital.in");
    expect(fd.get("phone")).toBe("+91 98765 43210");
    expect(fd.get("message")).toBe("Need surgical consumables");
    expect(await screen.findByRole("status")).toHaveTextContent(/thank you/i);
  });

  it("loads the Turnstile script only after the visitor focuses the form", () => {
    const turnstileScripts = () => document.querySelectorAll('script[src*="challenges.cloudflare.com/turnstile"]').length;
    render(<ConsultationForm />);
    expect(turnstileScripts()).toBe(0);
    fireEvent.focus(screen.getByLabelText("Your name"));
    expect(turnstileScripts()).toBe(1);
  });

  it("shows the server error and keeps the form when submission fails", async () => {
    sendInquiry.mockResolvedValue({ success: false, error: "Please enter a valid email address." });
    render(<ConsultationForm />);
    fireEvent.click(screen.getByRole("button", { name: /schedule a free consultation/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Please enter a valid email address.");
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
  });
});
