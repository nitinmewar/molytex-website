import Image from "next/image";
import { ConsultationForm } from "./ConsultationForm";

export function BrochureForm() {
  return (
    <section className="consult-sec bg-grey">
      <div className="consult-card">
        <div className="consult-media">
          <Image src="/assets/contact-team.webp" alt="Molytex team member packing surgical masks" fill sizes="(max-width: 920px) 100vw, 664px" style={{ objectFit: "cover", objectPosition: "-145.5px 50%" }} />
        </div>
        <div className="consult-panel">
          <span className="eyebrow">Schedule Consultation</span>
          <h2 className="consult-title">Let&rsquo;s Connect</h2>
          <p className="consult-lead">Connect with our team for a free consultation and tailored solutions.</p>
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}
