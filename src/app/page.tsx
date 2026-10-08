import "./home.css";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AboutPreview } from "@/components/home/AboutPreview";
import MetricsCounter from "@/components/home/MetricsCounter";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { ProductSlider } from "@/components/home/ProductSlider";
import { CertPreview } from "@/components/home/CertPreview";
import { CommitmentBand } from "@/components/home/CommitmentBand";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";
import { HomeFaq } from "@/components/home/HomeFaq";
import { BrochureForm } from "@/components/home/BrochureForm";
import { CtaBand } from "@/components/home/CtaBand";

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <AboutPreview />
      <MetricsCounter />
      <FeatureGrid />
      <ProductSlider />
      <CertPreview />
      <CommitmentBand />
      <PartnerMarquee />
      <HomeFaq />
      <BrochureForm />
      <CtaBand />
    </main>
  );
}
