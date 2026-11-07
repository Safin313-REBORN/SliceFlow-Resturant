import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { Pizza, Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-grey-border p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-white mx-auto shadow-md">
            <Pizza className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-brand-charcoal">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 animate-fade-in py-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-brand-charcoal font-medium">
              If an account matches <strong>{email}</strong>, a password reset link has been dispatched to your email.
            </p>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-grey-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
                  placeholder="you@example.com"
                />
                <Mail className="w-4 h-4 text-brand-grey absolute left-3.5 top-3" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-hover"
              loading={loading}
            >
              Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-grey hover:text-brand-red"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

