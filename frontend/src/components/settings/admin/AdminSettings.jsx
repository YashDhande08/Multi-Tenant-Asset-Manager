import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsLayout from '../SettingsLayout';
import SettingsSaveBar from '../SettingsSaveBar';
import Toggle from '../../common/Toggle';
import settingsService from '../../../services/settings.service';
import { useToast } from '../../../context/ToastContext';
import Loader from '../../common/Loader';
import Button from '../../common/Button';
import DashboardLayout from '../../layout/DashboardLayout';

const ADMIN_NAV = [
  { id: 'organization', label: 'Organization', icon: '🏢' },
  { id: 'users', label: 'Users & roles', icon: '👥' },
  { id: 'assets', label: 'Asset config', icon: '📦' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'integrations', label: 'Integrations', icon: '🔗' },
  { id: 'audit', label: 'Audit logs', icon: '📋' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
];

const defaultOrg = {
  name: '',
  email: '',
  phoneNo: '',
  baseCurrency: 'INR',
  logoUrl: '',
  timezone: 'Asia/Kolkata',
  language: 'en',
  settings: {},
};

const AdminSettings = () => {
  const toast = useToast();
  const [active, setActive] = useState('organization');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [org, setOrg] = useState(defaultOrg);
  const [savedOrg, setSavedOrg] = useState(defaultOrg);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const loadOrg = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getOrganization();
      const merged = { ...defaultOrg, ...data, settings: data.settings || {} };
      setOrg(merged);
      setSavedOrg(merged);
    } catch (e) {
      toast.error(e.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadAudit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const data = await settingsService.getAuditLogs({ limit: 30 });
      setAuditLogs(data.logs || []);
    } catch (e) {
      toast.error(e.message || 'Failed to load audit logs');
    } finally {
      setAuditLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadOrg();
  }, [loadOrg]);

  useEffect(() => {
    if (active === 'audit') loadAudit();
  }, [active, loadAudit]);

  const dirty = useMemo(() => JSON.stringify(org) !== JSON.stringify(savedOrg), [org, savedOrg]);

  const filteredNav = ADMIN_NAV.filter((n) =>
    n.label.toLowerCase().includes(search.toLowerCase())
  );

  const patchSettings = (key, value) => {
    setOrg((o) => ({
      ...o,
      settings: { ...o.settings, [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await settingsService.updateOrganization({
        name: org.name,
        email: org.email,
        phoneNo: org.phoneNo,
        baseCurrency: org.baseCurrency,
        logoUrl: org.logoUrl,
        timezone: org.timezone,
        language: org.language,
        settings: org.settings,
      });
      const merged = { ...defaultOrg, ...data, settings: data.settings || {} };
      setOrg(merged);
      setSavedOrg(merged);
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const s = org.settings || {};

  const renderSection = () => {
    switch (active) {
      case 'organization':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Organization settings</h2>
            <p className="settings-card-desc">Company profile, locale, and branding.</p>
            <div className="settings-grid-2">
              <div className="settings-field">
                <label className="settings-label">Organization name</label>
                <input className="settings-input" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
              </div>
              <div className="settings-field">
                <label className="settings-label">Contact email</label>
                <input className="settings-input" value={org.email || ''} onChange={(e) => setOrg({ ...org, email: e.target.value })} />
              </div>
              <div className="settings-field">
                <label className="settings-label">Phone</label>
                <input className="settings-input" value={org.phoneNo || ''} onChange={(e) => setOrg({ ...org, phoneNo: e.target.value })} />
              </div>
              <div className="settings-field">
                <label className="settings-label">Base currency</label>
                <select className="settings-select" value={org.baseCurrency} onChange={(e) => setOrg({ ...org, baseCurrency: e.target.value })}>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="settings-field">
                <label className="settings-label">Timezone</label>
                <select className="settings-select" value={org.timezone || ''} onChange={(e) => setOrg({ ...org, timezone: e.target.value })}>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div className="settings-field">
                <label className="settings-label">Language</label>
                <select className="settings-select" value={org.language || 'en'} onChange={(e) => setOrg({ ...org, language: e.target.value })}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <div className="settings-field sm:col-span-2">
                <label className="settings-label">Logo URL</label>
                <input className="settings-input" value={org.logoUrl || ''} onChange={(e) => setOrg({ ...org, logoUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          </section>
        );

      case 'users':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">User & role management</h2>
            <p className="settings-card-desc">Invite users, assign roles, and manage departments.</p>
            <Link to="/users">
              <Button>Open user management</Button>
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Multi-tenant isolation ensures users only access data within your organization.
            </p>
          </section>
        );

      case 'assets':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Asset management configuration</h2>
            <p className="settings-card-desc">Categories, custom fields, and maintenance workflows.</p>
            <Toggle label="Enable QR / barcode labels" checked={!!s.qrEnabled} onChange={(v) => patchSettings('qrEnabled', v)} />
            <Toggle label="Automatic depreciation tracking" checked={!!s.depreciationEnabled} onChange={(v) => patchSettings('depreciationEnabled', v)} />
            <Toggle label="Maintenance workflow alerts" checked={s.maintenanceWorkflow !== false} onChange={(v) => patchSettings('maintenanceWorkflow', v)} />
            <div className="settings-field mt-4">
              <label className="settings-label">Custom asset categories (comma-separated)</label>
              <input
                className="settings-input"
                value={(s.assetCategories || []).join(', ')}
                onChange={(e) =>
                  patchSettings(
                    'assetCategories',
                    e.target.value.split(',').map((x) => x.trim()).filter(Boolean)
                  )
                }
                placeholder="Real Estate, Vehicles, Equipment"
              />
            </div>
          </section>
        );

      case 'notifications':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Notification settings</h2>
            <p className="settings-card-desc">Email, push, and third-party channel alerts.</p>
            <Toggle label="Email alerts" checked={s.emailAlerts !== false} onChange={(v) => patchSettings('emailAlerts', v)} />
            <Toggle label="Push notifications" checked={!!s.pushNotifications} onChange={(v) => patchSettings('pushNotifications', v)} />
            <Toggle label="Slack integration" checked={!!s.slackEnabled} onChange={(v) => patchSettings('slackEnabled', v)} />
            <Toggle label="Microsoft Teams" checked={!!s.teamsEnabled} onChange={(v) => patchSettings('teamsEnabled', v)} />
            <Toggle label="Maintenance reminders" checked={s.maintenanceReminders !== false} onChange={(v) => patchSettings('maintenanceReminders', v)} />
          </section>
        );

      case 'security':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Security settings</h2>
            <p className="settings-card-desc">Authentication, session, and access policies.</p>
            <Toggle label="Require two-factor authentication" checked={!!s.twoFactorRequired} onChange={(v) => patchSettings('twoFactorRequired', v)} />
            <Toggle label="SSO / SAML enabled" checked={!!s.ssoEnabled} onChange={(v) => patchSettings('ssoEnabled', v)} />
            <div className="settings-field mt-4">
              <label className="settings-label">Session timeout (minutes)</label>
              <input
                type="number"
                className="settings-input max-w-xs"
                value={s.sessionTimeoutMinutes || 60}
                onChange={(e) => patchSettings('sessionTimeoutMinutes', parseInt(e.target.value, 10) || 60)}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Minimum password length</label>
              <input
                type="number"
                className="settings-input max-w-xs"
                value={s.passwordMinLength || 6}
                onChange={(e) => patchSettings('passwordMinLength', parseInt(e.target.value, 10) || 6)}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">IP whitelist (comma-separated)</label>
              <textarea
                className="settings-textarea"
                rows={3}
                value={(s.ipWhitelist || []).join(', ')}
                onChange={(e) =>
                  patchSettings(
                    'ipWhitelist',
                    e.target.value.split(',').map((x) => x.trim()).filter(Boolean)
                  )
                }
                placeholder="203.0.113.0, 198.51.100.0"
              />
            </div>
          </section>
        );

      case 'billing':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Billing & subscription</h2>
            <p className="settings-card-desc">Plan, usage, and invoices.</p>
            <div className="settings-plan-card settings-plan-card-highlight max-w-md">
              <p className="text-xs font-semibold uppercase text-gray-500">Current plan</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Enterprise</p>
              <p className="text-sm text-gray-600 mt-2">Unlimited assets · 50 users · Priority support</p>
              <Button className="mt-4">Upgrade plan</Button>
            </div>
            <div className="settings-grid-2 mt-6">
              <div className="settings-plan-card">
                <p className="text-sm text-gray-600">Assets tracked</p>
                <p className="text-xl font-bold">4.2M</p>
              </div>
              <div className="settings-plan-card">
                <p className="text-sm text-gray-600">Active users</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </section>
        );

      case 'integrations':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Integrations</h2>
            <p className="settings-card-desc">API keys, webhooks, and connected apps.</p>
            <div className="settings-field">
              <label className="settings-label">API key</label>
              <input className="settings-input font-mono text-sm" readOnly value={s.apiKeyMasked || 'pam_live_••••••••••••••••'} />
            </div>
            <Toggle label="Webhooks enabled" checked={!!s.webhooksEnabled} onChange={(v) => patchSettings('webhooksEnabled', v)} />
            <Toggle label="Zapier" checked={!!s.zapierEnabled} onChange={(v) => patchSettings('zapierEnabled', v)} />
            <Toggle label="Google Workspace" checked={!!s.googleWorkspace} onChange={(v) => patchSettings('googleWorkspace', v)} />
            <Toggle label="Slack" checked={!!s.slackIntegration} onChange={(v) => patchSettings('slackIntegration', v)} />
          </section>
        );

      case 'audit':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Audit logs</h2>
            <p className="settings-card-desc">User activities, asset changes, and login history.</p>
            {auditLoading ? (
              <div className="py-8 flex justify-center"><Loader /></div>
            ) : (
              <div className="settings-table-wrap">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Entity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-gray-500">No activity recorded yet.</td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td>{new Date(log.createdAt).toLocaleString()}</td>
                          <td>{log.user?.name || log.user?.email || '—'}</td>
                          <td>{log.action}</td>
                          <td>{log.entityType || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <Button variant="secondary" className="mt-4" onClick={loadAudit}>
              Refresh logs
            </Button>
          </section>
        );

      case 'appearance':
        return (
          <section className="settings-card">
            <h2 className="settings-card-title">Appearance customization</h2>
            <p className="settings-card-desc">Default theme and brand colors for your tenant.</p>
            <div className="settings-field">
              <label className="settings-label">Primary accent (lime)</label>
              <input
                type="color"
                className="h-10 w-20 rounded border"
                value={s.brandPrimary || '#d4ff00'}
                onChange={(e) => patchSettings('brandPrimary', e.target.value)}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Navy accent</label>
              <input
                type="color"
                className="h-10 w-20 rounded border"
                value={s.brandNavy || '#0f2744'}
                onChange={(e) => patchSettings('brandNavy', e.target.value)}
              />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20"><Loader size="lg" /></div>
      </DashboardLayout>
    );
  }

  return (
    <SettingsLayout
      title="Admin settings"
      subtitle="Manage organization, security, and platform configuration"
      badge={<span className="settings-badge settings-badge-admin">Admin</span>}
      search={search}
      onSearchChange={setSearch}
      sidebar={filteredNav.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`settings-nav-btn ${active === item.id ? 'settings-nav-btn-active' : ''}`}
          onClick={() => setActive(item.id)}
        >
          <span aria-hidden>{item.icon}</span>
          {item.label}
        </button>
      ))}
      saveBar={
        active !== 'users' && active !== 'audit' ? (
          <SettingsSaveBar dirty={dirty} saving={saving} onSave={handleSave} onDiscard={() => setOrg(savedOrg)} />
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </SettingsLayout>
  );
};

export default AdminSettings;
