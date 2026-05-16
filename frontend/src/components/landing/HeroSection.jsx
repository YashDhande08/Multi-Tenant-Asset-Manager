import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GeometricHeroVisual from './GeometricHeroVisual';
import { fadeUp, staggerContainer } from './motion';

const HeroSection = () => (
  <section className="lp-hero" id="solutions" aria-labelledby="hero-heading">
    <div className="lp-hero-inner">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p className="lp-hero-eyebrow" variants={fadeUp}>
          Multi-Tenant Asset Platform
        </motion.p>
        <motion.h1 id="hero-heading" className="lp-hero-title" variants={fadeUp}>
          CONTROL YOUR
          <span>ENTERPRISE ASSETS</span>
        </motion.h1>
        <motion.p className="lp-hero-lead" variants={fadeUp}>
          Manage tenants, track assets, automate workflows, and gain real-time visibility
          across your entire organization.
        </motion.p>
        <motion.div className="lp-hero-ctas" variants={fadeUp}>
          <Link to="/register" className="lp-btn-primary lp-hero-cta-lg">
            Get Started
          </Link>
          <a href="#preview" className="lp-btn-outline lp-hero-cta-lg">
            Book Demo
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <GeometricHeroVisual />
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
