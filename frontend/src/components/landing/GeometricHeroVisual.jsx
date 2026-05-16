import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from './motion';

const floatTransition = {
  duration: 5,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

const GeometricHeroVisual = () => (
  <div className="lp-geo-wrap" aria-hidden>
    <motion.div
      className="lp-float-shape lp-float-1"
      animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
      transition={floatTransition}
    />
    <motion.div
      className="lp-float-shape lp-float-2"
      animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
      transition={{ ...floatTransition, duration: 6 }}
    />

    <motion.div
      className="lp-geo-grid"
      variants={scaleIn}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="lp-geo-block lp-geo-lime"
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
      <motion.div
        className="lp-geo-block lp-geo-lavender"
        whileHover={{ scale: 1.03 }}
      />

      <motion.div className="lp-geo-block lp-geo-navy" whileHover={{ scale: 1.02 }}>
        <span className="lp-mini-label">Net worth</span>
        <span className="lp-mini-value">$4.2M</span>
        <div className="lp-mini-bar">
          <span style={{ height: '40%' }} />
          <span />
          <span />
          <span />
          <span />
        </div>
      </motion.div>

      <motion.div className="lp-geo-block lp-geo-dashboard" whileHover={{ scale: 1.01 }}>
        <span className="lp-mini-label" style={{ color: 'var(--lp-text-muted)' }}>
          Asset analytics
        </span>
        <motion.div
          className="lp-mini-bar"
          style={{ height: 56 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[35, 55, 75, 50, 90, 65, 80].map((h, i) => (
            <span
              key={i}
              style={{
                height: `${h}%`,
                background: i === 4 ? 'var(--lp-lime)' : 'color-mix(in srgb, var(--lp-navy) 20%, transparent)',
              }}
            />
          ))}
        </motion.div>
        <motion.div
          className="lp-mini-row"
          style={{ marginTop: 8, color: 'var(--lp-text)' }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
        >
          <span>Real estate</span>
          <span style={{ fontWeight: 700 }}>$1.8M</span>
        </motion.div>
        <motion.div
          className="lp-mini-row"
          style={{ color: 'var(--lp-text-muted)' }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
        >
          <span>Investments</span>
          <span style={{ fontWeight: 600 }}>$920K</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="lp-geo-block lp-geo-coral"
        animate={{ rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div className="lp-geo-block lp-geo-teal" whileHover={{ scale: 1.04 }} />

      <motion.div className="lp-geo-block lp-geo-tenant" whileHover={{ scale: 1.02 }}>
        <span className="lp-mini-label" style={{ color: 'var(--lp-text-muted)' }}>
          Tenants
        </span>
        {['Acme Corp', 'Northwind', 'Vertex'].map((t) => (
          <div key={t} className="lp-mini-row" style={{ fontSize: '0.625rem' }}>
            <span>{t}</span>
            <span style={{ color: 'var(--lp-teal)', fontWeight: 700 }}>Active</span>
          </div>
        ))}
      </motion.div>

      <motion.div className="lp-geo-block lp-geo-device" whileHover={{ scale: 1.02 }}>
        <span className="lp-mini-label">Device fleet</span>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                height: 28,
                borderRadius: 8,
                background: n === 2 ? 'var(--lp-lime)' : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.625rem', opacity: 0.7, marginTop: 8, display: 'block' }}>
          248 assets monitored
        </span>
      </motion.div>
    </motion.div>
  </div>
);

export default GeometricHeroVisual;
