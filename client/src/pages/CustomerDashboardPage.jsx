import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Mail,
  RotateCcw,
} from 'lucide-react';

const CustomerDashboardPage = () => {
  const { user, isEmailVerified } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendStatus, setResendStatus] = useState('');

  const handleReorder = (order) => {
    order.orderItems.forEach((item) => {
      addToCart({
        type: item.type || 'standard',
        pizzaId: item.pizzaId,
        name: item.name,
        basePrice: item.unitPrice,
        quantity: item.quantity || 1,
        category: 'Veg',
      });
    });
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    navigate('/cart');
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleResendVerification = async () => {
    try {
      setResendStatus('Sending...');
      const res = await api.post('/auth/resend-verification', { email: user?.email });
      setResendStatus(res.message || 'Verification email dispatched!');
    } catch (err) {
      setResendStatus(err.message || 'Failed to send verification email.');
    }
  };

  const activeOrders = orders.filter((o) =>
    ['Order Received', 'In Kitchen', 'Sent to Delivery'].includes(o.orderStatus)
  );
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl border border-brand-grey-border p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red font-display font-extrabold text-2xl flex items-center justify-center shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-brand-grey mt-0.5">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              {isEmailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Account
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Email Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        {!isEmailVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-sm">
            <p className="text-xs text-amber-900 font-medium mb-2">
              Verify your email to unlock online checkout and custom pizza orders.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              icon={Mail}
            >
              {resendStatus || 'Resend Verification Email'}
            </Button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-brand-grey-border shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Total Orders</span>
          <h3 className="font-display font-extrabold text-3xl text-brand-charcoal mt-1">
            {orders.length}
          </h3>
          <p className="text-xs text-brand-grey mt-1">All-time lifetime orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-grey-border shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red">Active in Kitchen</span>
          <h3 className="font-display font-extrabold text-3xl text-brand-red mt-1">
            {activeOrders.length}
          </h3>
          <p className="text-xs text-brand-grey mt-1">Orders currently in progress</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-grey-border shadow-subtle">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Delivered</span>
          <h3 className="font-display font-extrabold text-3xl text-emerald-700 mt-1">
            {completedOrders.length}
          </h3>
          <p className="text-xs text-brand-grey mt-1">Successfully fulfilled orders</p>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-3xl border border-brand-grey-border p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-brand-grey-border">
          <h2 className="font-display font-bold text-xl text-brand-charcoal">
            Order History & Live Tracking
          </h2>
          <Link to="/menu">
            <Button variant="outline" size="sm">
              Explore Menu
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-brand-grey">Fetching order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders placed yet"
            description="You haven't placed any orders yet. Discover our handcrafted pizzas and treat yourself today!"
            actionText="Build Your First Pizza"
            actionLink="/build"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-brand-grey-border text-brand-grey text-xs uppercase">
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Items</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-brand-charcoal">
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 px-4 text-brand-grey">
                      {new Date(o.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-brand-charcoal">
                        {o.orderItems.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-display font-bold text-brand-charcoal">
                      ₹{o.totalAmount}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-brand-yellow/30 text-amber-900 border border-brand-yellow/40 animate-pulse'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/orders/${o._id}`}>
                          <Button variant="ghost" size="sm" icon={ExternalLink}>
                            Track
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={RotateCcw}
                          onClick={() => handleReorder(o)}
                          title="Reorder items into cart"
                        >
                          Reorder
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;

