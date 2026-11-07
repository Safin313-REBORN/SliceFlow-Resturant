import React, { useState } from 'react';
import Button from '../common/Button';
import { X, PackagePlus, Edit2 } from 'lucide-react';

const InventoryModal = ({ item, isOpen, onClose, onSave }) => {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'base',
    description: item?.description || '',
    priceAdjustment: item?.priceAdjustment || 0,
    quantity: item?.quantity || 100,
    lowStockThreshold: item?.lowStockThreshold || 20,
    unit: item?.unit || 'portions',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData, item?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save inventory item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl border border-brand-grey-border shadow-modal w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-brand-grey-border flex items-center justify-between bg-brand-cream/40">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Edit2 className="w-5 h-5 text-brand-red" />
            ) : (
              <PackagePlus className="w-5 h-5 text-brand-red" />
            )}
            <h3 id="inventory-modal-title" className="font-display font-bold text-lg text-brand-charcoal">
              {isEditing ? `Edit Inventory: ${item.name}` : 'Add New Inventory Ingredient'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {!isEditing && (
            <>
              <div>
                <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  placeholder="e.g. Buffalo Mozzarella"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
                  >
                    <option value="base">Base Crust</option>
                    <option value="sauce">Sauce</option>
                    <option value="cheese">Cheese</option>
                    <option value="vegetable">Vegetable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                    Price Adj. (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.priceAdjustment}
                    onChange={(e) => setFormData({ ...formData, priceAdjustment: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                Low-Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Measurement Unit
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="portions, crusts, ladles"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-grey-border">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              {isEditing ? 'Save Changes' : 'Create Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;

