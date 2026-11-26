import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { resetPasswordEmail } from '@/services/supabaseService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setIsLoading(true);
    const res = await resetPasswordEmail(email.trim());
    setIsLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-nature-surface p-8 sm:p-10 rounded-3xl border border-nature-border shadow-editorial">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-nature-parchment">
            Reset Password
          </h1>
          <p className="text-xs text-nature-textMuted">
            Enter your registered email and we'll transmit a secure recovery link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-nature-dark/80 border border-nature-border text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-nature-accent mx-auto" />
            <p className="text-sm text-nature-parchment">
              Recovery link dispatched to <strong className="text-nature-accent">{email}</strong>.
            </p>
            <p className="text-xs text-nature-textMuted">
              Check your inbox (and spam folder) within the next few minutes.
            </p>
            <Link to="/login" className="inline-block pt-2">
              <Button variant="outline" size="sm">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-xs text-red-600 dark:text-red-300">
                {error}
              </div>
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="photographer@naturelens.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center shadow-editorial"
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send Recovery Email
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-nature-border/40 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-nature-textMuted hover:text-nature-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
