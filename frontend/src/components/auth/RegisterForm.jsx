import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Loader from '../common/Loader';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tenantName: '',
    tenantEmail: '',
    phoneNo: '',
    baseCurrency: 'INR',
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.tenantName) {
      setError('Organization name is required');
      return false;
    }

    if (!formData.line1 || !formData.city || !formData.state) {
      setError('Please fill in address details');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      <header>
        <h1 className="auth-form-title">Create your workspace</h1>
        <p className="auth-form-subtitle">
          Register your organization and administrator account. You can invite team members after setup.
        </p>
      </header>

      {error && (
        <div className="auth-alert" role="alert">
          {error}
        </div>
      )}

      <div className="auth-form-section">
        <h2 className="auth-form-section-title">Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="mb-0"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            className="mb-0"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            required
            className="mb-0"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            required
            className="mb-0"
          />
        </div>
      </div>

      <div className="auth-form-section">
        <h2 className="auth-form-section-title">Organization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Organization Name"
            name="tenantName"
            value={formData.tenantName}
            onChange={handleChange}
            placeholder="Your company or team"
            required
            className="mb-0"
          />

          <Input
            label="Organization Email"
            type="email"
            name="tenantEmail"
            value={formData.tenantEmail}
            onChange={handleChange}
            placeholder="org@example.com"
            className="mb-0"
          />

          <Input
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="+91 1234567890"
            className="mb-0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
            <select
              name="baseCurrency"
              value={formData.baseCurrency}
              onChange={handleChange}
              className="auth-select theme-transition"
            >
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <h2 className="auth-form-section-title">Address</h2>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Address Line 1"
            name="line1"
            value={formData.line1}
            onChange={handleChange}
            placeholder="Street address"
            required
            className="mb-0"
          />

          <Input
            label="Address Line 2"
            name="line2"
            value={formData.line2}
            onChange={handleChange}
            placeholder="Apartment, suite, etc. (optional)"
            className="mb-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="mb-0"
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="mb-0"
            />

            <Input
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="PIN / ZIP"
              className="mb-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="auth-select theme-transition"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader size="sm" /> : 'Create organization'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
