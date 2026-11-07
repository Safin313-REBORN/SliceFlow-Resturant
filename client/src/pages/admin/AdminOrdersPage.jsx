import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bike,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const statuses = [
  'ALL',
  'Order Received',
  'In Kitchen',
  'Sent to Delivery',
  'Delivered',
  'Cancelled',
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/admin/orders?${params.toString()}`);
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setActionMessage('');

    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: `Updated from Kitchen Admin Console to ${newStatus}`,
      });

      if (res.success) {
        setActionMessage(`Order #${orderId.slice(-6).toUpperCase()} transitioned to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red block mb-1">
            Kitchen Orders
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal">
            Order Fulfillment & Live Dispatch
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          Refresh List
        </Button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-grey-border shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedStatus === status
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'bg-gray-100 text-brand-charcoal hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search customer, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-brand-grey-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
            />
            <Search className="w-4 h-4 text-brand-grey absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-brand-grey-border shadow-subtle overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-brand-grey">Fetching order queue...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={ShoppingBag}
              title="No Orders Found"
              description="No orders currently match the selected filter criteria."
              actionText="Reset Filter"
              onAction={() => setSelectedStatus('ALL')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-brand-cream/50 border-b border-brand-grey-border text-brand-grey uppercase">
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer & Contact</th>
                  <th className="py-3 px-4 font-bold">Items & Recipes</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Payment</th>
                  <th className="py-3 px-4 font-bold">Current Status</th>
                  <th className="py-3 px-4 font-bold">Advance State</th>
                  <th className="py-3 px-4 font-bold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => {
                  const isUpdating = updatingId === o._id;

                  return (
                    <tr key={o._id} className="hover:bg-brand-cream/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-brand-charcoal">
                        #{o._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-brand-charcoal">
                          {o.customerDetails?.name || o.userId?.name}
                        </p>
                        <p className="text-gray-500 text-[11px]">{o.customerDetails?.phone}</p>
                        <p className="text-gray-400 text-[10px] truncate max-w-[140px]">
                          {o.customerDetails?.street}, {o.customerDetails?.city}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {o.orderItems.map((item, idx) => (
                            <div key={idx} className="text-[11px]">
                              <span className="font-bold text-brand-red">{item.quantity}x</span>{' '}
                              <span className="font-medium text-brand-charcoal">{item.name}</span>
                              {item.type === 'custom' && item.customization && (
                                <p className="text-[10px] text-gray-400">
                                  {item.customization.base?.name} • {item.customization.sauce?.name}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-display font-bold text-brand-charcoal">
                        ₹{o.totalAmount}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-brand-yellow/30 text-amber-900 border border-brand-yellow/50'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>

                      {/* Advance State Control */}
                      <td className="py-4 px-4">
                        {o.orderStatus === 'Order Received' && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isUpdating}
                            loading={isUpdating}
                            onClick={() => handleStatusChange(o._id, 'In Kitchen')}
                          >
                            Send to Kitchen
                          </Button>
                        )}
                        {o.orderStatus === 'In Kitchen' && (
                          <Button
                            variant="yellow"
                            size="sm"
                            disabled={isUpdating}
                            loading={isUpdating}
                            onClick={() => handleStatusChange(o._id, 'Sent to Delivery')}
                          >
                            Dispatch Delivery
                          </Button>
                        )}
                        {o.orderStatus === 'Sent to Delivery' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                            disabled={isUpdating}
                            loading={isUpdating}
                            onClick={() => handleStatusChange(o._id, 'Delivered')}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {['Delivered', 'Cancelled'].includes(o.orderStatus) && (
                          <span className="text-[11px] text-gray-400 italic">Complete</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/orders/${o._id}`}
                          target="_blank"
                          className="p-1 text-brand-grey hover:text-brand-red inline-block"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;

