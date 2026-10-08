import type { Metadata } from "next";
import Image from "next/image";
import "../pages.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Molytex Healthcare collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <div className="phero-img">
        <Image
          src="/assets/hero-1.png"
          alt="Molytex team packing surgical face masks"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 15%" }}
        />
      </div>

      <section className="policy">
        <div className="wrap">
          <h1>Privacy Policy</h1>
          <div className="policy-body">
            <p>
              This privacy policy describes how we handle your personal information. By using https://www.molytexproducts.com/ (the &ldquo;Site&rdquo;) you consent to the storage, processing, transfer and disclosure of your personal information as described in this privacy policy.
            </p>

            <h2>Collection</h2>
            <p>
              You may browse this Site without providing any personal information about yourself. However, to receive notifications, updates or request additional information about https://www.molytexproducts.com/ or this Site, we may collect the following information: name, contact information, email address, company and user ID; correspondence sent to or from us; any additional information you choose to provide; and other information from your interaction with our Site, services, content and advertising, including computer and connection information, statistics on page views, traffic to and from the Site, ad data, IP address and standard web log information.
            </p>
            <p>
              If you choose to provide us with personal information, you consent to the transfer and storage of that information on our servers located in the India.
            </p>

            <h2>Use</h2>
            <p>
              We use your personal information to provide you with the services you request, communicate with you, troubleshoot problems, customize your experience, inform you about our services and Site updates and measure interest in our sites and services.
            </p>

            <h2>Disclosure</h2>
            <p>
              We don&rsquo;t sell or rent your personal information to third parties for their marketing purposes without your explicit consent. We may disclose personal information to respond to legal requirements, enforce our policies, respond to claims that a posting or other content violates other&rsquo;s rights, or protect anyone&rsquo;s rights, property, or safety. Such information will be disclosed in accordance with applicable laws and regulations. We may also share personal information with service providers who help with our business operations, and with members of our corporate family, who may provide joint content and services and help detect and prevent potentially illegal acts. Should we plan to merge or be acquired by another business entity, we may share personal information with the other company and will require that the new combined entity follow this privacy policy with respect to your personal information.
            </p>

            <h2>Access</h2>
            <p>
              You may access or update the personal information you provided to us at any time by contacting us at:{" "}
              <a href="mailto:info@molytexproducts.com">info@molytexproducts.com</a>
            </p>
            <p>
              We treat information as an asset that must be protected and use lots of tools to protect your personal information against unauthorized access and disclosure. However, as you probably know, third parties may unlawfully intercept or access transmissions or private communications. Therefore, although we work very hard to protect your privacy, we do not promise, and you should not expect that your personal information or private communications will always remain private.
            </p>

            <h2>General</h2>
            <p>
              We may update this policy at any time by posting amended terms on this site. All amended terms automatically take effect 30 days after they are initially posted on the site. For questions about this policy, please send email to us.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
