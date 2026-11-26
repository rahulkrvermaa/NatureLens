import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';
import { signInWithEmail, signInWithGoogle } from '@/services/supabaseService';

const GoogleIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
    />
  </svg>
);

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dbConnected = useNatureStore((s) => s.dbConnected);
  const loginDemo = useNatureStore((s) => s.loginDemo);
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    if (dbConnected) {
      const res = await signInWithEmail(email.trim(), password);
      setIsLoading(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      showToast('Signed in successfully!', 'success');
      navigate('/explore');
      return;
    }

    const user = loginDemo(email.trim());
    setIsLoading(false);
    showToast(`Welcome back, ${user.full_name}!`, 'success');
    navigate('/explore');
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const res = await signInWithGoogle();
    if (res.error) {
      setIsGoogleLoading(false);
      setError(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-nature-surface p-8 sm:p-10 rounded-3xl border border-nature-border shadow-editorial">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-nature-elevated border border-nature-border flex items-center justify-center mx-auto text-nature-accent mb-4">
            <Camera className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-nature-parchment">
            Welcome Back
          </h1>
          <p className="text-xs text-nature-textMuted">
            Sign in to your NatureLens account to manage your portfolio
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-nature-elevated hover:bg-nature-border/50 border border-nature-border text-sm font-medium text-nature-parchment transition-colors disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{isGoogleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-nature-border" />
          <span className="px-3 text-[11px] uppercase tracking-wider text-nature-textSubtle font-mono">
            or email
          </span>
          <div className="flex-grow border-t border-nature-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-xs text-red-600 dark:text-red-300">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="elena_frost@naturelens.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-nature-textMuted cursor-pointer">
              <input type="checkbox" className="rounded bg-nature-elevated border-nature-border text-nature-accent focus:ring-0" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-nature-accent hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="pt-4 border-t border-nature-border text-center text-xs text-nature-textMuted space-y-3">
          <p>
            Don't have a profile yet?{' '}
            <Link to="/signup" className="text-nature-accent font-semibold hover:underline">
              Join the Community
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-nature-textSubtle">
            <ShieldCheck className="w-3.5 h-3.5 text-nature-accent" />
            <span>Protected by Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};
