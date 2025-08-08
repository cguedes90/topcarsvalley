import HeroSection from '@/components/landing/HeroSection';
import Navigation from '@/components/navigation/Navigation';
import AboutSection from '@/components/landing/AboutSection';
import ServicesSection from '@/components/landing/ServicesSection';
import WhySection from '@/components/landing/WhySection';
import MemberAccessSection from '@/components/landing/MemberAccessSection';
import Footer from '@/components/navigation/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhySection />
      <MemberAccessSection />
      <Footer />
    </main>
  );
}
