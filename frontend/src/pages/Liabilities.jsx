import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LiabilityList from '../components/liabilities/LiabilityList';
import LiabilityForm from '../components/liabilities/LiabilityForm';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import liabilityService from '../services/liability.service';

const Liabilities = () => {
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLiability, setEditingLiability] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLiabilities();
  }, []);

  const fetchLiabilities = async () => {
    try {
      setLoading(true);
      const response = await liabilityService.getLiabilities();
      setLiabilities(response.data || []);
    } catch (error) {
      console.error('Error fetching liabilities:', error);
      setError('Failed to load liabilities');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLiability(null);
    setIsModalOpen(true);
    setError('');
  };

  const handleEdit = (liability) => {
    setEditingLiability(liability);
    setIsModalOpen(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this liability?')) {
      try {
        await liabilityService.deleteLiability(id);
        fetchLiabilities();
      } catch (error) {
        console.error('Error deleting liability:', error);
        setError('Failed to delete liability');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError('');
      if (editingLiability) {
        await liabilityService.updateLiability(editingLiability.id, formData);
      } else {
        await liabilityService.createLiability(formData);
      }
      setIsModalOpen(false);
      fetchLiabilities();
    } catch (error) {
      console.error('Error saving liability:', error);
      setError(error.message || 'Failed to save liability');
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
            <h1 className="text-3xl font-bold text-gray-900">Liabilities</h1>
            <p className="text-gray-600 mt-1">Track your outstanding debts and obligations</p>
          </div>
          <Button onClick={handleAdd}>+ Add Liability</Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <LiabilityList
          liabilities={liabilities}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLiability(null);
            setError('');
          }}
          title={editingLiability ? 'Edit Liability' : 'Add New Liability'}
          size="lg"
        >
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <LiabilityForm
            liability={editingLiability}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingLiability(null);
              setError('');
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Liabilities;
