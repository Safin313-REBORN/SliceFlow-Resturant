import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-brand-grey">Aggregating kitchen metrics and revenue...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const recentOrders = data?.recentOrders || [];
  const lowStockItems = data?.lowStockItems || [];
  const revenueByDay = data?.charts?.revenueByDay || [];
  const statusDistribution = data?.charts?.statusDistribution || [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red block mb-1">
            Kitchen Overview
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal">
            Operations Dashboard
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboard}>
          Refresh Metrics
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Verified Revenue"
          value={`₹${metrics.totalRevenue || 0}`}
          subtext="Captured via Razorpay"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders || 0}
          subtext="Lifetime placed orders"
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Active in Kitchen"
          value={metrics.pendingOrders || 0}
          subtext="Currently baking / in delivery"
          icon={Clock}
          color="red"
        />
        <StatCard
          title="Low Stock Items"
          value={metrics.lowStockCount || 0}
          subtext="Below threshold"
          icon={AlertTriangle}
          color="yellow"
        />
      </div>

      {/* Low-Stock Warning Banner if any items triggered */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-bold text-sm text-amber-900">
                Action Required: {lowStockItems.length} ingredients below safety threshold!
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {lowStockItems.map((i) => `${i.name} (${i.quantity} left)`).join(', ')}
              </p>
            </div>
          </div>
          <Link to="/admin/inventory">
            <Button variant="yellow" size="sm">
              Replenish Stock
            </Button>
          </Link>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-brand-grey-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-grey-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-red" />
              <h3 className="font-display font-bold text-base text-brand-charcoal">
                Revenue Trajectory (Past 7 Days)
              </h3>
            </div>
            <span className="text-xs font-semibold text-brand-grey">Verified Payments</span>
          </div>

          {revenueByDay.length === 0 ? (
            <div className="py-12 text-center text-xs text-brand-grey">
              No recent payments in the past 7 days to chart yet.
            </div>
          ) : (
            <div className="pt-4 space-y-3">
              {revenueByDay.map((day) => {
                const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1);
                const percent = Math.min(100, Math.round((day.revenue / maxRevenue) * 100));

                return (
                  <div key={day._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-brand-charcoal">
                      <span>{day._id}</span>
                      <span>₹{day.revenue} ({day.count} orders)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-brand-red h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Order Status Distribution */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-brand-grey-border p-6 shadow-subtle space-y-4">
          <h3 className="font-display font-bold text-base text-brand-charcoal pb-3 border-b border-brand-grey-border">
            Orders by Status
          </h3>

          <div className="space-y-3 pt-2">
            {statusDistribution.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs"
              >
                <span className="font-semibold text-brand-charcoal">{item._id}</span>
                <span className="font-display font-extrabold text-sm text-brand-red bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-brand-grey-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-grey-border">
          <h3 className="font-display font-bold text-base text-brand-charcoal">
            Recent 10 Orders
          </h3>
          <Link to="/admin/orders" className="text-xs font-bold text-brand-red hover:underline">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-grey-border text-brand-grey uppercase">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-brand-cream/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-brand-charcoal">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-3 font-medium text-brand-charcoal">
                    {order.customerDetails?.name || order.userId?.name || 'Customer'}
                  </td>
                  <td className="py-3 px-3 text-brand-grey truncate max-w-xs">
                    {order.orderItems.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-brand-charcoal">
                    ₹{order.totalAmount}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-brand-yellow/30 text-amber-900 border border-brand-yellow/50'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/orders/${order._id}`}
                      target="_blank"
                      className="text-brand-red font-bold hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

