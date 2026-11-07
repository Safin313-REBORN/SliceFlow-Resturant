import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided in URL.');
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Your email address has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(res.message || 'Email verification failed or expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Invalid or expired verification link.');
      }
    };

    performVerification();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-grey-border p-8 shadow-card text-center space-y-6">
        {status === 'verifying' && (
          <div className="space-y-4 py-8">
            <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="font-display font-bold text-xl text-brand-charcoal">
              Verifying Your Email...
            </h2>
            <p className="text-xs text-brand-grey">Please wait while we confirm your credentials.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-brand-charcoal">
              Email Verified!
            </h2>
            <p className="text-sm text-brand-grey leading-relaxed">{message}</p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="primary" size="lg" className="w-full" icon={ArrowRight}>
                  Log In to SliceFlow
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-brand-charcoal">
              Verification Failed
            </h2>
            <p className="text-sm text-red-600 leading-relaxed">{message}</p>
            <div className="pt-4 space-y-2">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;

