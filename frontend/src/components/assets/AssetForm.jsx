import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import assetService from '../../services/asset.service';

const AssetForm = ({ asset, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    assetTypeId: '',
    description: '',
    currency: 'INR',
    acquisitionDate: '',
    valueAmount: '',
    valueDate: new Date().toISOString().split('T')[0],
  });

  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssetTypes();
    if (asset) {
      const latestValue = asset.valueHistory && asset.valueHistory.length > 0
        ? asset.valueHistory[0]
        : null;

      setFormData({
        name: asset.name || '',
        assetTypeId: asset.assetTypeId?.toString() || '',
        description: asset.description || '',
        currency: asset.currency || 'INR',
        acquisitionDate: asset.acquisitionDate
          ? new Date(asset.acquisitionDate).toISOString().split('T')[0]
          : '',
        valueAmount: latestValue ? parseFloat(latestValue.valueAmount).toString() : '',
        valueDate: latestValue
          ? new Date(latestValue.valueDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [asset]);

  const fetchAssetTypes = async () => {
    try {
      // In a real app, this would come from an API endpoint
      // For now, using common asset types
      const types = [
        { id: 1, name: 'Real Estate' },
        { id: 2, name: 'Stocks' },
        { id: 3, name: 'Bonds' },
        { id: 4, name: 'Mutual Funds' },
        { id: 5, name: 'Cash' },
        { id: 6, name: 'Crypto' },
        { id: 7, name: 'Retirement Accounts' },
        { id: 8, name: 'Other' },
      ];
      setAssetTypes(types);
    } catch (error) {
      console.error('Error fetching asset types:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      assetTypeId: parseInt(formData.assetTypeId),
      valueAmount: parseFloat(formData.valueAmount),
      acquisitionDate: formData.acquisitionDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Asset Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Mumbai Apartment, Apple Stock"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asset Type <span className="text-red-500">*</span>
        </label>
        <select
          name="assetTypeId"
          value={formData.assetTypeId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select asset type</option>
          {assetTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Current Value"
          name="valueAmount"
          type="number"
          step="0.01"
          value={formData.valueAmount}
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

      <Input
        label="Value Date"
        name="valueDate"
        type="date"
        value={formData.valueDate}
        onChange={handleChange}
        required
      />

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
          placeholder="Additional details about this asset"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          {asset ? 'Update Asset' : 'Create Asset'}
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

export default AssetForm;
