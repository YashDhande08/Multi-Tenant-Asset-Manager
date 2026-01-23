import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AssetList from '../components/assets/AssetList';
import AssetForm from '../components/assets/AssetForm';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import assetService from '../services/asset.service';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await assetService.getAssets();
      setAssets(response.data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
    setError('');
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.deleteAsset(id);
        fetchAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
        setError('Failed to delete asset');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError('');
      if (editingAsset) {
        await assetService.updateAsset(editingAsset.id, formData);
      } else {
        await assetService.createAsset(formData);
      }
      setIsModalOpen(false);
      fetchAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
      setError(error.message || 'Failed to save asset');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
            <p className="text-gray-600 mt-1">Manage your financial assets</p>
          </div>
          <Button onClick={handleAdd}>+ Add Asset</Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <AssetList
          assets={assets}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAsset(null);
            setError('');
          }}
          title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
          size="lg"
        >
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <AssetForm
            asset={editingAsset}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingAsset(null);
              setError('');
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Assets;
