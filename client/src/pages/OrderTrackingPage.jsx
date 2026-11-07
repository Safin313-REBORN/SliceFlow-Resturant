import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import OrderTimeline from '../components/order/OrderTimeline';
import Button from '../components/common/Button';
import {
  Clock,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Pizza,
  CheckCircle2,
} from 'lucide-react';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { liveOrderEvent, joinOrderRoom } = useSocket();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    joinOrderRoom(id);
  }, [id]);

  // Update order when socket event arrives
  useEffect(() => {
    if (liveOrderEvent && liveOrderEvent.orderId === id) {
      setOrder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          orderStatus: liveOrderEvent.orderStatus,
          paymentStatus: liveOrderEvent.paymentStatus || prev.paymentStatus,
          statusHistory: liveOrderEvent.statusHistory || prev.statusHistory,
        };
      });
    }
  }, [liveOrderEvent, id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-semibold text-brand-charcoal">Loading live order status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-brand-charcoal">Order Not Found</h2>
        <p className="text-sm text-brand-grey">{error || "We couldn't locate this order."}</p>
        <Link to="/dashboard">
          <Button variant="primary">Return to Order History</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & ID */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-grey-border gap-4">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-grey hover:text-brand-red mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                order.paymentStatus === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <p className="text-xs text-brand-grey mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchOrder}>
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Visual Live Stepper Timeline */}
      <OrderTimeline
        currentStatus={order.orderStatus}
        statusHistory={order.statusHistory}
        estimatedMinutes={order.estimatedDeliveryMinutes || 35}
      />

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ordered Pizzas & Customizations */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-brand-grey-border p-6 shadow-subtle space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-charcoal pb-3 border-b border-brand-grey-border flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-red" />
            Items in this Order
          </h3>

          <div className="space-y-4">
            {order.orderItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-gray-100 bg-brand-cream/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-red text-sm">{item.quantity}x</span>
                    <span className="font-bold text-sm text-brand-charcoal">{item.name}</span>
                  </div>
                  <span className="font-display font-bold text-sm text-brand-charcoal">
                    ₹{item.totalPrice}
                  </span>
                </div>

                {item.type === 'custom' && item.customization && (
                  <div className="text-xs text-brand-grey pl-6 space-y-0.5 border-l-2 border-brand-red/30">
                    <p>• Crust: {item.customization.base?.name}</p>
                    <p>• Sauce: {item.customization.sauce?.name}</p>
                    <p>• Cheese: {item.customization.cheese?.name}</p>
                    {item.customization.vegetables?.length > 0 && (
                      <p>• Toppings: {item.customization.vegetables.map((v) => v.name).join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-brand-grey-border space-y-1.5 text-xs text-brand-grey">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-brand-charcoal">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-brand-charcoal">₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (5%):</span>
              <span className="font-semibold text-brand-charcoal">₹{order.tax}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-brand-charcoal pt-2 border-t border-gray-100">
              <span>Total Paid:</span>
              <span className="text-brand-red text-base font-display font-extrabold">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Payment Metadata */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-brand-grey-border p-6 shadow-subtle space-y-4">
            <h3 className="font-display font-bold text-base text-brand-charcoal pb-3 border-b border-brand-grey-border flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-red" />
              Delivery Destination
            </h3>
            <div className="text-xs text-brand-grey space-y-1 leading-relaxed">
              <p className="font-bold text-sm text-brand-charcoal">{order.customerDetails?.name}</p>
              <p>{order.customerDetails?.street}</p>
              <p>{order.customerDetails?.city} - {order.customerDetails?.pincode}</p>
              <p className="text-brand-charcoal font-medium pt-1">Phone: {order.customerDetails?.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-grey-border p-6 shadow-subtle space-y-4">
            <h3 className="font-display font-bold text-base text-brand-charcoal pb-3 border-b border-brand-grey-border flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-red" />
              Payment Details
            </h3>
            <div className="text-xs text-brand-grey space-y-1.5">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold text-brand-charcoal">Razorpay Test Gateway</span>
              </div>
              <div className="flex justify-between">
                <span>Razorpay Order ID:</span>
                <span className="font-mono text-brand-charcoal truncate max-w-[150px]">{order.razorpayOrderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono text-brand-charcoal truncate max-w-[150px]">{order.razorpayPaymentId || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;

