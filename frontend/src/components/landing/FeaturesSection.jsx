import React from 'react';
import { motion } from 'framer-motion';
import FeatureIcon from './FeatureIcon';
import { FEATURES } from './landingData';
import { fadeUp, staggerContainer, viewportOnce } from './motion';

const FeaturesSection = () => (
  <section className="lp-section" id="features" aria-labelledby="features-heading">
    <div className="lp-section-inner">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <p className="lp-section-label">Platform capabilities</p>
        <h2 id="features-heading" className="lp-section-title">
          Everything you need to manage assets at scale
        </h2>
        <p className="lp-section-lead">
          Enterprise-grade tools designed for multi-tenant operations, from onboarding
          to analytics.
        </p>
      </motion.div>

      <motion.ul
        className="lp-features-grid"
        role="list"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {FEATURES.map((feature, i) => (
          <motion.li
            key={feature.title}
            className="lp-feature-card"
            variants={fadeUp}
            whileHover={{ y: -6 }}
          >
            <div className="lp-feature-icon">
              <FeatureIcon name={feature.icon} />
            </div>
            <h3 className="lp-feature-title">{feature.title}</h3>
            <p className="lp-feature-desc">{feature.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  </section>
);

export default FeaturesSection;
