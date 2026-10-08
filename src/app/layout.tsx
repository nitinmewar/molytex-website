import type { Metadata } from "next";
import { Archivo, Public_Sans, Work_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactDialog } from "@/components/contact/ContactDialog";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Molytex Healthcare — Medical & Surgical Products",
    template: "%s — Molytex Healthcare",
  },
  description:
    "Molytex Healthcare delivers reliable medical and surgical products trusted by hospitals, clinics, and healthcare institutions across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${publicSans.variable} ${workSans.variable}`}
    >
      <body>
        <Header />
        {children}
        <Footer />
        <ContactDialog />
      </body>
    </html>
  );
}
