import type { Metadata } from "next";
import Image from "next/image";
import "../pages.css";

export const metadata: Metadata = {
  title: "Intellectual Property & Trademark Notice",
  description: "Molytex is a trademark of MoleQule Products Pvt Ltd.",
};

export default function TrademarkPage() {
  return (
    <main>
      <div className="phero-img">
        <Image
          src="/assets/hero-1.webp"
          alt="Molytex team packing surgical face masks"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 15%" }}
        />
      </div>

      <section className="policy">
        <div className="wrap">
          <h1>Intellectual Property &amp; Trademark Notice</h1>
          <div className="policy-body">
            <p>
              Molytex is a trademark of MoleQule Products Pvt Ltd. The Molytex name, logo and associated brand identity are the property of MoleQule Products Pvt Ltd. Unauthorised use of these marks is prohibited, subject to applicable law.
            </p>
            <p>
              All website content, product descriptions, graphics and other materials are protected by applicable intellectual property laws, where applicable.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
