import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, Check, AlertCircle } from 'lucide-react';

const stages = [
  { id: 'Order Received', label: 'Order Received', icon: Clock, desc: 'Confirmed & sent to kitchen' },
  { id: 'In Kitchen', label: 'In Kitchen', icon: ChefHat, desc: 'Handcrafted & stone-baked' },
  { id: 'Sent to Delivery', label: 'Sent to Delivery', icon: Bike, desc: 'Hot & on the road' },
  { id: 'Delivered', label: 'Delivered', icon: Check, desc: 'Enjoy your artisan pizza!' },
];

const statusOrderMap = {
  'Order Received': 1,
  'In Kitchen': 2,
  'Sent to Delivery': 3,
  'Delivered': 4,
  'Cancelled': -1,
};

const OrderTimeline = ({ currentStatus, statusHistory = [], estimatedMinutes = 35 }) => {
  const currentRank = statusOrderMap[currentStatus] || 1;
  const isCancelled = currentStatus === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-6">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
        <h3 className="font-display font-bold text-lg text-red-800">Order Cancelled</h3>
        <p className="text-sm text-red-600 mt-1">This order has been cancelled and any reserved inventory released.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-grey-border p-6 shadow-subtle my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-grey-border gap-2">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Live Order Progress
          </span>
          <h3 className="font-sans font-bold text-xl text-espresso mt-0.5">
            Current Status: <span className="text-primary">{currentStatus}</span>
          </h3>
        </div>
        <div className="bg-ivory-soft px-3.5 py-1.5 rounded-xl border border-ivory-border inline-flex items-center gap-2 text-xs">
          <Clock className="w-4 h-4 text-primary" />
          <span>
            Est. Delivery: <strong>~{estimatedMinutes} mins</strong> (Estimated)
          </span>
        </div>
      </div>

      {/* Animated Live Progress Track */}
      <div className="hidden sm:block relative h-2.5 bg-ivory-soft rounded-full overflow-hidden mt-6 mb-2">
        <div
          className="h-full bg-primary bg-stripes transition-all duration-700 rounded-full shadow-sm"
          style={{ width: `${Math.min(100, Math.max(15, (currentRank / 4) * 100))}%` }}
        />
      </div>

      {/* Progress Stepper */}
      <div className="pt-4 pb-4 relative">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
          {stages.map((stage, idx) => {
            const stepRank = idx + 1;
            const isCompleted = currentRank > stepRank;
            const isCurrent = currentRank === stepRank;
            const Icon = stage.icon;

            const matchingHistory = statusHistory.find((h) => h.status === stage.id);

            return (
              <div key={stage.id} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center relative gap-4 sm:gap-2 group">
                {/* Visual node */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-status-success text-white shadow-md'
                      : isCurrent
                      ? 'bg-primary text-white ring-4 ring-primary/20 shadow-lg scale-110 animate-pulse-ring'
                      : 'bg-ivory-soft text-espresso-muted border border-ivory-border'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h4
                    className={`font-sans font-bold text-sm ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-espresso'
                        : 'text-espresso-muted'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-xs text-espresso-muted mt-0.5 font-sans">{stage.desc}</p>
                  {matchingHistory && (
                    <span className="text-[11px] text-status-success font-semibold block mt-1">
                      {new Date(matchingHistory.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;

