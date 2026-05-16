import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, viewportOnce } from './motion';

const DashboardPreviewSection = () => (
  <section className="lp-section" id="preview" aria-labelledby="preview-heading">
    <motion.div
      className="lp-section-inner"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
    >
      <p className="lp-section-label">Dashboard preview</p>
      <h2 id="preview-heading" className="lp-section-title">
        Real-time visibility across every tenant
      </h2>
      <p className="lp-section-lead">
        Monitor net worth, asset allocation, and liability exposure from a unified
        command center.
      </p>

      <motion.div
        className="lp-preview-wrap"
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="lp-preview-chrome">
          <span className="lp-preview-dot" style={{ background: '#ff6b6b' }} />
          <span className="lp-preview-dot" style={{ background: '#d4ff00' }} />
          <span className="lp-preview-dot" style={{ background: '#94a3b8' }} />
        </div>
        <div className="lp-preview-body">
          <aside className="lp-preview-sidebar">
            <span className="active">Overview</span>
            <span>Assets</span>
            <span>Liabilities</span>
            <span>Tenants</span>
            <span>Reports</span>
          </aside>
          <div className="lp-preview-main">
            <div className="lp-preview-metrics">
              <div className="lp-preview-metric">
                <small>Total assets</small>
                <strong>$4.2M</strong>
              </div>
              <motion.div className="lp-preview-metric" whileHover={{ scale: 1.03 }}>
                <small>Liabilities</small>
                <strong>$890K</strong>
              </motion.div>
              <div className="lp-preview-metric">
                <small>Net worth</small>
                <strong style={{ color: 'var(--lp-teal)' }}>$3.31M</strong>
              </div>
            </div>
            <div className="lp-preview-chart" aria-hidden />
            <div className="lp-preview-table">
              <div className="lp-preview-table-row">
                <span>Asset</span>
                <span>Type</span>
                <span>Value</span>
              </div>
              {[
                ['Downtown Office', 'Real Estate', '$1.2M'],
                ['Growth Fund A', 'Investment', '$680K'],
                ['Fleet Vehicles', 'Equipment', '$240K'],
              ].map(([name, type, value]) => (
                <div key={name} className="lp-preview-table-row">
                  <span>{name}</span>
                  <span>{type}</span>
                  <span style={{ fontWeight: 600, color: 'var(--lp-text)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default DashboardPreviewSection;
