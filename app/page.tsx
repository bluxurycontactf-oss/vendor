import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturedShops from '@/components/landing/FeaturedShops';
import RecommendedShops from '@/components/landing/RecommendedShops';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <FeaturedShops />
      <RecommendedShops />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
