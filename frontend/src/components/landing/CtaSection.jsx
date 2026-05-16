import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from './motion';

const CtaSection = () => (
  <motion.section
    className="lp-cta"
    id="docs"
    aria-labelledby="cta-heading"
    initial="hidden"
    whileInView="visible"
    viewport={viewportOnce}
    variants={fadeUp}
  >
    <h2 id="cta-heading" className="lp-cta-title">
      Start Managing Assets Smarter
    </h2>
    <p className="lp-cta-lead">
      Join enterprises that trust TenancyOS for multi-tenant asset operations,
      real-time analytics, and secure team collaboration.
    </p>
    <Link to="/register" className="lp-btn-primary lp-hero-cta-lg">
      Get Started Free
    </Link>
  </motion.section>
);

export default CtaSection;
