import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Zap, Flame } from 'lucide-react';

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: 'admin@sliceflow.com',
    password: 'AdminSecurePassword123!',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAutoFill = (email, password) => {
    setFormData({ email, password });
    setError('');
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.65 } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminLogin(formData.email, formData.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B2721] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl space-y-6 border border-ivory-border animate-scale-in">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-forest text-white flex items-center justify-center mx-auto shadow-md">
            <Flame className="w-7 h-7 fill-honey text-honey" />
          </div>
          <h2 className="font-display font-bold text-2xl text-espresso">
            Kitchen Administration
          </h2>
          <p className="text-xs text-espresso-muted">
            Restricted access portal for SliceFlow managers, chefs, and inventory coordinators.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-status-error flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Credentials Panel */}
        <div className="bg-ivory-soft border border-ivory-border rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-espresso">
                Master Admin Credentials
              </span>
            </div>
            <span className="text-[10px] font-bold text-forest bg-forest-light px-2 py-0.5 rounded-full border border-forest/20">
              Full Access
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-ivory-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="font-mono text-[11px] text-espresso-muted space-y-0.5">
              <p>Email: <span className="font-semibold text-espresso">admin@sliceflow.com</span></p>
              <p>Pass: <span className="font-semibold text-espresso">AdminSecurePassword123!</span></p>
            </div>
            <button
              type="button"
              onClick={() => handleAutoFill('admin@sliceflow.com', 'AdminSecurePassword123!')}
              className="py-1.5 px-3 bg-forest hover:bg-forest-hover text-white rounded-lg text-xs font-bold transition-all shrink-0 active:scale-95 shadow-sm"
            >
              1-Click Auto Fill
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-ivory-soft text-espresso font-medium"
                placeholder="admin@sliceflow.com"
              />
              <Mail className="w-4 h-4 text-espresso-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-ivory-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-ivory-soft text-espresso"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-espresso-muted absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-espresso-muted hover:text-espresso"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate & Access Dashboard'}
          </button>
        </form>

        <div className="pt-4 border-t border-ivory-border text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
