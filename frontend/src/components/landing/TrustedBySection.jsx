import React from 'react';
import { motion } from 'framer-motion';
import { TRUSTED_LOGOS } from './landingData';
import { fadeUp, viewportOnce } from './motion';

const TrustedBySection = () => (
  <section className="lp-trusted" aria-labelledby="trusted-heading">
    <div className="lp-section-inner">
      <motion.div
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <p id="trusted-heading" className="lp-section-label">
          Trusted by enterprises
        </p>
        <h2 className="lp-section-title" style={{ marginBottom: 0 }}>
          Powering asset operations worldwide
        </h2>
      </motion.div>
      <motion.div
        className="lp-trusted-logos"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {TRUSTED_LOGOS.map((name) => (
          <motion.span
            key={name}
            className="lp-trusted-logo"
            variants={fadeUp}
            whileHover={{ scale: 1.05, opacity: 1 }}
          >
            {name}
          </motion.span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TrustedBySection;
