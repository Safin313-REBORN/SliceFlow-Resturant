import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  Utensils,
  Plus,
  Search,
  Check,
  X,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const FALLBACK_FOOD_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23F1E9DE'/%3E%3Ctext x='50%25' y='55%25' font-size='32' text-anchor='middle' dominant-baseline='middle'%3E🍕%3C/text%3E%3C/svg%3E";

const AdminMenuManagementPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Form State
  const initialForm = {
    name: '',
    category: 'Pizza',
    basePrice: '',
    description: '',
    longDescription: '',
    image: '',
    preparationTime: '15-20 mins',
    portionInformation: 'Serves 1-2',
    spiceLevel: 0,
    dietaryTags: 'Vegetarian',
    isAvailable: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/menu');
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setItems(list);
    } catch (err) {
      console.error('Failed to load menu items for admin:', err);
      // Fallback: try public /pizzas endpoint
      try {
        const fallback = await api.get('/pizzas');
        const list = Array.isArray(fallback.data) ? fallback.data : (fallback.data?.data || []);
        setItems(list);
      } catch (e) {
        setActionError('Failed to load menu items.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleToggleAvailability = async (item) => {
    try {
      const newStatus = !item.isAvailable;
      const res = await api.patch(`/admin/menu/${item._id}`, { isAvailable: newStatus });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, isAvailable: newStatus } : i))
      );
      setActionSuccess(`Updated availability for "${item.name}"`);
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (err) {
      console.error('Error toggling availability:', err);
      setActionError('Failed to update availability status.');
      setTimeout(() => setActionError(''), 2500);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      basePrice: item.basePrice,
      description: item.description,
      longDescription: item.longDescription || item.description,
      image: item.image,
      preparationTime: item.preparationTime || '15-20 mins',
      portionInformation: item.portionInformation || 'Serves 1-2',
      spiceLevel: item.spiceLevel || 0,
      dietaryTags: item.dietaryTags?.join(', ') || 'Vegetarian',
      isAvailable: item.isAvailable,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        spiceLevel: Number(formData.spiceLevel),
        dietaryTags: formData.dietaryTags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingItem) {
        // Update existing item
        const res = await api.patch(`/admin/menu/${editingItem._id}`, payload);
        if (res.data?.data) {
          setItems((prev) =>
            prev.map((i) => (i._id === editingItem._id ? res.data.data : i))
          );
          setActionSuccess(`Successfully updated "${payload.name}"!`);
        }
      } else {
        // Create new item
        const res = await api.post('/admin/menu', payload);
        if (res.data?.data) {
          setItems((prev) => [res.data.data, ...prev]);
          setActionSuccess(`Successfully added "${payload.name}" to menu!`);
        }
      }

      setModalOpen(false);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to save menu item:', err);
      setActionError(err.response?.data?.message || 'Failed to save menu item.');
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}" from the menu catalogue?`)) {
      return;
    }

    try {
      await api.delete(`/admin/menu/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      setActionSuccess(`Deleted "${item.name}" from catalogue.`);
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (err) {
      console.error('Failed to delete item:', err);
      setActionError('Failed to delete menu item.');
      setTimeout(() => setActionError(''), 2500);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && item.isAvailable) ||
      (statusFilter === 'unavailable' && !item.isAvailable);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCount = items.length;
  const availableCount = items.filter((i) => i.isAvailable).length;
  const unavailableCount = totalCount - availableCount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Catalogue Management
          </span>
          <h1 className="font-display font-bold text-3xl text-espresso tracking-tight">
            Menu & Food Items
          </h1>
          <p className="text-xs text-espresso-muted mt-1">
            Configure restaurant dishes, live pricing, stock availability, and portion metadata across 7 categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-forest-light text-forest border border-forest/20 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 text-status-error border border-status-error/20 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-ivory-border shadow-subtle hover-lift transition-all">
          <span className="text-xs font-bold text-espresso-muted font-sans">Total Dishes</span>
          <p className="font-sans font-extrabold text-2xl text-espresso tracking-tight mt-1">{totalCount}</p>
          <span className="text-[10px] text-espresso-muted font-sans">Across 7 Categories</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-ivory-border shadow-subtle hover-lift transition-all">
          <span className="text-xs font-bold text-forest font-sans">Live & Ordering</span>
          <p className="font-sans font-extrabold text-2xl text-forest tracking-tight mt-1">{availableCount}</p>
          <span className="text-[10px] text-espresso-muted font-sans">Visible to customers</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-ivory-border shadow-subtle hover-lift transition-all">
          <span className="text-xs font-bold text-status-error font-sans">Out of Stock</span>
          <p className="font-sans font-extrabold text-2xl text-status-error tracking-tight mt-1">{unavailableCount}</p>
          <span className="text-[10px] text-espresso-muted font-sans">Hidden from cart</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-ivory-border shadow-subtle hover-lift transition-all">
          <span className="text-xs font-bold text-honey font-sans">Featured Collections</span>
          <p className="font-sans font-extrabold text-2xl text-espresso tracking-tight mt-1">5</p>
          <span className="text-[10px] text-espresso-muted font-sans">Curated homepage rows</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-ivory-border shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {['All', 'Pizza', 'Burgers', 'Pasta', 'Sides', 'Desserts', 'Drinks', 'Combos'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-forest text-white shadow-sm scale-105'
                    : 'bg-ivory-soft text-espresso hover:bg-ivory-border border border-ivory-border active:scale-95'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-ivory-border text-xs bg-ivory-soft focus:outline-none focus:ring-2 focus:ring-primary text-espresso"
            />
            <Search className="w-3.5 h-3.5 text-espresso-muted absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-ivory-border text-xs bg-ivory-soft font-bold text-espresso cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-espresso">
            <thead className="bg-ivory-soft border-b border-ivory-border text-[11px] uppercase tracking-wider text-espresso-muted font-bold">
              <tr>
                <th className="px-5 py-4">Dish</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Portion & Prep</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4 text-center">Live Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-espresso-muted">
                    Loading restaurant catalogue...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-espresso-muted">
                    No menu items match your search.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-ivory-soft/50 transition-colors">
                    {/* Dish Preview */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-ivory-soft shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_FOOD_IMG;
                          }}
                        />
                        <div className="max-w-[200px] sm:max-w-[260px]">
                          <p className="font-bold text-espresso truncate">{item.name}</p>
                          <p className="text-[11px] text-espresso-muted line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-light text-forest border border-forest/20">
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3.5 font-bold font-sans text-sm text-espresso">
                      ₹{item.basePrice}
                    </td>

                    {/* Prep & Portions */}
                    <td className="px-5 py-3.5 text-espresso-muted text-[11px]">
                      <p>{item.portionInformation || 'Single'}</p>
                      <p className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{item.preparationTime || '15 mins'}</span>
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-3.5 font-semibold text-espresso">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-honey fill-honey" />
                        <span>{item.rating || 4.8}</span>
                        <span className="text-[10px] text-espresso-muted">
                          ({item.ratingCount || 100})
                        </span>
                      </div>
                    </td>

                    {/* Live Toggle */}
                    <td className="px-5 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                          item.isAvailable
                            ? 'bg-forest-light text-forest border border-forest/30'
                            : 'bg-red-50 text-status-error border border-red-200'
                        }`}
                        title="Click to toggle customer visibility"
                      >
                        {item.isAvailable ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-espresso-muted hover:text-primary hover:bg-ivory-soft transition-colors"
                          title="Edit item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 rounded-lg text-espresso-muted hover:text-status-error hover:bg-red-50 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Item Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-modal overflow-hidden border border-ivory-border p-6 sm:p-7 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-ivory-border">
              <h3 className="font-display font-bold text-xl text-espresso">
                {editingItem ? `Edit: ${editingItem.name}` : 'Add New Restaurant Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-ivory-soft hover:bg-ivory-border text-espresso flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="py-4 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="e.g. Truffle Smash Burger"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Sides">Sides</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Combos">Combos</option>
                  </select>
                </div>
              </div>

              {/* Price, Prep Time, Portions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                    placeholder="349"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="15-20 mins"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Portion Info</label>
                  <input
                    type="text"
                    value={formData.portionInformation}
                    onChange={(e) => setFormData({ ...formData, portionInformation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Serves 1-2 • 350g"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-espresso mb-1">Food Photo URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-espresso mb-1">Short Description</label>
                <textarea
                  required
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Appetizing summary for product cards..."
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-xs font-bold text-espresso mb-1">Detailed Culinary Description</label>
                <textarea
                  rows="3"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Extended notes on ingredients, oven baking method, and pairing suggestions..."
                />
              </div>

              {/* Dietary Tags & Spice Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    Dietary Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.dietaryTags}
                    onChange={(e) => setFormData({ ...formData, dietaryTags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Vegetarian, Chef Special"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Spice Level</label>
                  <select
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border text-xs bg-ivory-soft text-espresso focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="0">0 - No Spice / Mild</option>
                    <option value="1">1 - Mild Kick</option>
                    <option value="2">2 - Medium Heat</option>
                    <option value="3">3 - Fiery Hot</option>
                  </select>
                </div>
              </div>

              {/* Availability checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modalIsAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <label htmlFor="modalIsAvailable" className="text-xs font-bold text-espresso cursor-pointer">
                  Mark as Available Immediately for Customer Ordering
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-ivory-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-ivory-border text-xs font-bold text-espresso hover:bg-ivory-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  {editingItem ? 'Save Changes' : 'Create Menu Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuManagementPage;
