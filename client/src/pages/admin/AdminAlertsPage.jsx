import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { AlertTriangle, CheckCircle2, BellRing, RefreshCw, Mail } from 'lucide-react';

const AdminAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/alerts');
      if (res.success && res.data) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-red block mb-1">
            Safety Monitoring
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal">
            Low Stock Alerts & Notifications Log
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAlerts} icon={RefreshCw}>
          Refresh Alerts
        </Button>
      </div>

      {/* Info Callout */}
      <div className="bg-brand-cream border border-brand-cream-dark rounded-2xl p-5 flex items-start gap-4">
        <Mail className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
        <div className="text-xs text-brand-charcoal space-y-1">
          <p className="font-bold text-sm">Automated Email Notification & Rearming Engine</p>
          <p className="text-brand-grey leading-relaxed">
            SliceFlow monitors configurable low-stock thresholds (default: 20 units) using node-cron. When an item falls below its safety threshold, an automated email alert is dispatched to <strong>admin@sliceflow.com</strong>. Alerts automatically re-arm once the ingredient is replenished above its threshold.
          </p>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-2xl border border-brand-grey-border shadow-subtle overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-brand-grey">Checking safety logs...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={CheckCircle2}
              title="All Ingredients Optimal"
              description="No active low-stock alerts recorded. Kitchen stock levels are currently above configured safety thresholds."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-brand-cream/50 border-b border-brand-grey-border text-brand-grey uppercase">
                  <th className="py-3 px-4 font-bold">Ingredient Name</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Stock at Alert</th>
                  <th className="py-3 px-4 font-bold">Configured Threshold</th>
                  <th className="py-3 px-4 font-bold">Notification Status</th>
                  <th className="py-3 px-4 font-bold text-right">Last Dispatched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alerts.map((a) => (
                  <tr key={a._id} className="hover:bg-brand-cream/20 transition-colors">
                    <td className="py-4 px-4 font-bold text-brand-charcoal text-sm">
                      {a.ingredientName}
                    </td>

                    <td className="py-4 px-4 capitalize text-brand-grey">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold">
                        {a.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-red-600">
                      {a.stockSnapshot} units
                    </td>

                    <td className="py-4 px-4 font-medium text-brand-charcoal">
                      {a.thresholdSnapshot} units
                    </td>

                    <td className="py-4 px-4">
                      {a.alertStatus === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <BellRing className="w-3 h-3 text-amber-600" />
                          ACTIVE ALERT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          RESOLVED (REARMED)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right text-brand-grey">
                      {new Date(a.lastNotifiedAt || a.updatedAt).toLocaleString()}
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

export default AdminAlertsPage;

