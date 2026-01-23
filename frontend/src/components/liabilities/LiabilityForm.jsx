import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const LiabilityForm = ({ liability, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    liabilityTypeId: '',
    description: '',
    currentValue: '',
    interestRate: '',
    monthlyPayment: '',
    currency: 'INR',
    acquisitionDate: '',
  });

  const [liabilityTypes, setLiabilityTypes] = useState([]);

  useEffect(() => {
    fetchLiabilityTypes();
    if (liability) {
      setFormData({
        name: liability.name || '',
        liabilityTypeId: liability.liabilityTypeId?.toString() || '',
        description: liability.description || '',
        currentValue: liability.currentValue ? parseFloat(liability.currentValue).toString() : '',
        interestRate: liability.interestRate ? parseFloat(liability.interestRate).toString() : '',
        monthlyPayment: liability.monthlyPayment ? parseFloat(liability.monthlyPayment).toString() : '',
        currency: liability.currency || 'INR',
        acquisitionDate: liability.acquisitionDate
          ? new Date(liability.acquisitionDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [liability]);

  const fetchLiabilityTypes = async () => {
    try {
      // In a real app, this would come from an API endpoint
      const types = [
        { id: 1, name: 'Mortgage' },
        { id: 2, name: 'Personal Loan' },
        { id: 3, name: 'Credit Card Debt' },
        { id: 4, name: 'Car Loan' },
        { id: 5, name: 'Student Loan' },
        { id: 6, name: 'Other' },
      ];
      setLiabilityTypes(types);
    } catch (error) {
      console.error('Error fetching liability types:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      liabilityTypeId: parseInt(formData.liabilityTypeId),
      currentValue: parseFloat(formData.currentValue),
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : null,
      monthlyPayment: formData.monthlyPayment ? parseFloat(formData.monthlyPayment) : null,
      acquisitionDate: formData.acquisitionDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Liability Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Home Mortgage, Credit Card"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Liability Type <span className="text-red-500">*</span>
        </label>
        <select
          name="liabilityTypeId"
          value={formData.liabilityTypeId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select liability type</option>
          {liabilityTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Current Value"
          name="currentValue"
          type="number"
          step="0.01"
          value={formData.currentValue}
          onChange={handleChange}
          placeholder="0.00"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="INR">INR - Indian Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Interest Rate (%)"
          name="interestRate"
          type="number"
          step="0.01"
          value={formData.interestRate}
          onChange={handleChange}
          placeholder="e.g., 7.5"
        />

        <Input
          label="Monthly Payment"
          name="monthlyPayment"
          type="number"
          step="0.01"
          value={formData.monthlyPayment}
          onChange={handleChange}
          placeholder="0.00"
        />
      </div>

      <Input
        label="Acquisition Date"
        name="acquisitionDate"
        type="date"
        value={formData.acquisitionDate}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          placeholder="Additional details about this liability"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          {liability ? 'Update Liability' : 'Create Liability'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default LiabilityForm;
