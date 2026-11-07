import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import InventoryModal from '../../components/admin/InventoryModal';
import Button from '../../components/common/Button';
import {
  Package,
  Search,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const categories = ['All', 'base', 'sauce', 'cheese', 'vegetable'];

const AdminInventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/admin/inventory?${params.toString()}`);
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleSaveItem = async (formData, itemId) => {
    if (itemId) {
      // Edit existing
      const res = await api.patch(`/admin/inventory/${itemId}`, {
        quantity: formData.quantity,
        lowStockThreshold: formData.lowStockThreshold,
        unit: formData.unit,
      });
      if (res.success) {
        setToastMessage(`Updated stock for ${res.data.name}`);
        fetchInventory();
      }
    } else {
      // Add new
      const res = await api.post('/admin/inventory', formData);
      if (res.success) {
        setToastMessage(`Added new ingredient: ${res.data.ingredient.name}`);
        fetchInventory();
      }
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red block mb-1">
            Raw Ingredient Ledger
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal">
            Inventory & Stock Management
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={Plus}>
            Add Ingredient
          </Button>
          <Button variant="outline" size="sm" onClick={fetchInventory}>
            Refresh
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-grey-border shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'bg-gray-100 text-brand-charcoal hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Ingredients' : cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search ingredient by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-brand-grey-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
            />
            <Search className="w-4 h-4 text-brand-grey absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-brand-grey-border shadow-subtle overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-brand-grey">Inspecting stock ledger...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-brand-cream/50 border-b border-brand-grey-border text-brand-grey uppercase">
                  <th className="py-3 px-4 font-bold">Ingredient Name</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Physical Stock</th>
                  <th className="py-3 px-4 font-bold">Reserved</th>
                  <th className="py-3 px-4 font-bold">Available to Order</th>
                  <th className="py-3 px-4 font-bold">Threshold</th>
                  <th className="py-3 px-4 font-bold">Health Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => {
                  const isLow = item.quantity <= item.lowStockThreshold;
                  const isCritical = item.quantity === 0;

                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-brand-cream/20 transition-colors ${
                        isLow ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-brand-charcoal text-sm">
                        {item.name}
                      </td>

                      <td className="py-3.5 px-4 capitalize text-brand-grey">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-brand-charcoal">
                        {item.quantity} {item.unit}
                      </td>

                      <td className="py-3.5 px-4 text-brand-grey font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Lock className="w-3 h-3 text-gray-400" />
                          {item.reservedQuantity} {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-display font-bold text-sm text-brand-charcoal">
                        {item.availableQuantity} {item.unit}
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 font-medium">
                        {item.lowStockThreshold} {item.unit}
                      </td>

                      <td className="py-3.5 px-4">
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Optimal
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(item)}
                          icon={Edit2}
                        >
                          Adjust
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inventory Add/Edit Modal */}
      <InventoryModal
        isOpen={modalOpen}
        item={selectedItem}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default AdminInventoryPage;

