import React from 'react';
import { motion } from 'framer-motion';
import { METRICS, WHY_POINTS } from './landingData';
import { fadeUp, staggerContainer, viewportOnce } from './motion';

const WhyChooseSection = () => (
  <section className="lp-section" id="pricing" aria-labelledby="why-heading">
    <div className="lp-section-inner">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <p className="lp-section-label">Why choose us</p>
        <h2 id="why-heading" className="lp-section-title">
          Performance built for enterprise teams
        </h2>
      </motion.div>

      <div className="lp-why-grid">
        <motion.div
          className="lp-metrics-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {METRICS.map((m) => (
            <motion.div key={m.label} className="lp-metric-card" variants={fadeUp}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.ul
          className="lp-why-list"
          role="list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {WHY_POINTS.map((point) => (
            <motion.li key={point.title} className="lp-why-item" variants={fadeUp}>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
