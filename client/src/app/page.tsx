import CTA from "@/components/home/CTA";
import FeatureSection from "@/components/home/FeatureSection";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import Footer from "@/components/nav/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <CTA />
      <Footer />
    </div>
  );
}
