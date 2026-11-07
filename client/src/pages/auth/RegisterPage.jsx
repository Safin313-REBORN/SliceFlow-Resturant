import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { Pizza, Eye, EyeOff, Lock, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      setRegisteredSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registeredSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-brand-grey-border p-8 shadow-card text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-brand-charcoal">
            Account Created!
          </h2>
          <p className="text-sm text-brand-grey leading-relaxed">
            We've sent a verification link to <strong>{formData.email}</strong>. Please check your inbox and verify your email to unlock order placement and custom pizza building.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button variant="primary" size="lg" className="w-full">
                Proceed to Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-grey-border p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white mx-auto shadow-md">
            <Pizza className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-charcoal">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey">
            Join SliceFlow to enjoy fast checkout, custom pizzas, and real-time delivery tracking.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
                placeholder="Jane Doe"
              />
              <User className="w-4 h-4 text-brand-grey absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
                placeholder="you@example.com"
              />
              <Mail className="w-4 h-4 text-brand-grey absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
              Password (Min 8 characters & 1 number)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-brand-grey absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-brand-grey hover:text-brand-charcoal"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-brand-grey absolute left-3.5 top-3" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-hover"
            loading={loading}
          >
            Create SliceFlow Account
          </Button>
        </form>

        <div className="pt-4 border-t border-brand-grey-border text-center text-xs text-brand-grey">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-red hover:underline">
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

