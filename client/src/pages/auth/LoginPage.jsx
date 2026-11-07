import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { Flame, Eye, EyeOff, Lock, Mail, AlertCircle, Zap, UserCheck, Shield } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: 'customer@sliceflow.com',
    password: 'Customer123!',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleAutoFill = (email, password) => {
    setFormData({ email, password });
    setError('');
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.65 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border p-8 shadow-card space-y-6 animate-scale-in transition-colors">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-ember flex items-center justify-center text-white mx-auto shadow-glow">
            <Flame className="w-7 h-7 stroke-[2.2] fill-honey text-honey" />
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-espresso dark:text-dark-text transition-colors">
            Welcome to SliceFlow
          </h2>
          <p className="text-xs sm:text-sm text-espresso-muted dark:text-dark-muted transition-colors">
            Log in to manage your orders, customize pizzas, and track deliveries.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-status-error flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Credentials Panel */}
        <div className="bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border rounded-2xl p-4 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-espresso dark:text-dark-text">
                Demo Accounts (1-Click Login)
              </span>
            </div>
            <span className="text-[10px] font-bold text-forest dark:text-emerald-400 bg-forest-light dark:bg-forest/20 px-2 py-0.5 rounded-full border border-forest/20">
              Testing Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Customer Demo */}
            <div className="bg-white dark:bg-dark-card p-3 rounded-xl border border-ivory-border dark:border-dark-border flex flex-col justify-between space-y-2.5 shadow-sm transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-espresso dark:text-dark-text flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-primary" />
                    Customer Demo
                  </span>
                  <span className="text-[10px] font-semibold text-forest dark:text-emerald-400 bg-forest-light dark:bg-forest/20 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <div className="mt-1.5 space-y-0.5 font-mono text-[11px] text-espresso-muted dark:text-dark-muted">
                  <p className="truncate">customer@sliceflow.com</p>
                  <p>Pass: <span className="font-semibold text-espresso dark:text-dark-text">Customer123!</span></p>
                </div>
              </div>
              <Button
                type="button"
                variant="primary"
                size="xs"
                onClick={() => handleAutoFill('customer@sliceflow.com', 'Customer123!')}
                className="w-full"
              >
                1-Click Auto Fill
              </Button>
            </div>

            {/* Admin Demo */}
            <div className="bg-white dark:bg-dark-card p-3 rounded-xl border border-ivory-border dark:border-dark-border flex flex-col justify-between space-y-2.5 shadow-sm transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-espresso dark:text-dark-text flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-forest dark:text-emerald-400" />
                    Kitchen Admin
                  </span>
                  <span className="text-[10px] font-semibold text-forest dark:text-emerald-400 bg-forest-light dark:bg-forest/20 px-1.5 py-0.5 rounded">
                    Manager
                  </span>
                </div>
                <div className="mt-1.5 space-y-0.5 font-mono text-[11px] text-espresso-muted dark:text-dark-muted">
                  <p className="truncate">admin@sliceflow.com</p>
                  <p>Pass: <span className="font-semibold text-espresso dark:text-dark-text">AdminSecurePassword123!</span></p>
                </div>
              </div>
              <Link
                to="/admin/login"
                className="w-full"
              >
                <Button
                  type="button"
                  variant="forest"
                  size="xs"
                  className="w-full"
                >
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ivory-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text font-medium transition-colors"
                placeholder="you@example.com"
              />
              <Mail className="w-4 h-4 text-espresso-muted dark:text-dark-muted absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-ivory-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text transition-colors"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-espresso-muted dark:text-dark-muted absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-espresso-muted dark:text-dark-muted hover:text-espresso dark:hover:text-dark-text cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            loading={loading}
            className="w-full shadow-md uppercase tracking-wider text-xs"
          >
            {loading ? 'Authenticating...' : 'Log In'}
          </Button>
        </form>

        <div className="pt-4 border-t border-ivory-border dark:border-dark-border text-center text-xs text-espresso-muted dark:text-dark-muted transition-colors">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
