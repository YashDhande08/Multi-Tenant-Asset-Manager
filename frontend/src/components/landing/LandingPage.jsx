import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TrustedBySection from './TrustedBySection';
import DashboardPreviewSection from './DashboardPreviewSection';
import WhyChooseSection from './WhyChooseSection';
import CtaSection from './CtaSection';
import LandingFooter from './LandingFooter';
import './landing.css';

const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
  <motion.div
    className="landing-page min-h-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <LandingNavbar />
    <main>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <WhyChooseSection />
      <CtaSection />
    </main>
    <LandingFooter />
  </motion.div>
  );
};

export default LandingPage;
