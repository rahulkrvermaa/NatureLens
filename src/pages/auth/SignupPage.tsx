import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, User, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';
import { signInWithGoogle, signUpWithEmail } from '@/services/supabaseService';

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

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dbConnected = useNatureStore((s) => s.dbConnected);
  const signupDemo = useNatureStore((s) => s.signupDemo);
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pledgeAgreed, setPledgeAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeAgreed) {
      setError('You must agree to the Ethical Wildlife & Nature Photography Pledge to join.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setIsLoading(true);

    if (dbConnected) {
      const res = await signUpWithEmail({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        username: username.replace(/^@/, '').trim(),
      });
      setIsLoading(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.needsConfirmation) {
        showToast('Account created! Check your email to confirm, or sign in.', 'info');
        navigate('/login');
        return;
      }
      showToast(`Welcome to NatureLens, ${fullName.trim()}!`, 'success');
      navigate('/explore');
      return;
    }

    const user = signupDemo({ fullName, username, email });
    setIsLoading(false);
    showToast(`Welcome to NatureLens, ${user.full_name}!`, 'success');
    navigate(`/@${user.username}`);
  };

  const handleGoogleSignup = async () => {
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
            Create Your Portfolio
          </h1>
          <p className="text-xs text-nature-textMuted">
            Join photographers sharing the natural world
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-nature-elevated hover:bg-nature-border/50 border border-nature-border text-sm font-medium text-nature-parchment transition-colors disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{isGoogleLoading ? 'Redirecting to Google...' : 'Sign up with Google'}</span>
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
            label="Full Name"
            type="text"
            placeholder="Elena Rostova"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Username Handle"
            type="text"
            placeholder="elena_frost"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftIcon={<span className="text-xs font-mono text-nature-textMuted">@</span>}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="elena@arcticlens.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password (min 6 characters)"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div
            onClick={() => setPledgeAgreed(!pledgeAgreed)}
            className="p-3.5 rounded-2xl bg-nature-elevated border border-nature-border flex items-start gap-3 cursor-pointer select-none transition-colors hover:border-nature-accent/40"
          >
            <div className="text-nature-accent mt-0.5 shrink-0">
              {pledgeAgreed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-nature-textMuted" />}
            </div>
            <p className="text-xs text-nature-textMuted leading-relaxed">
              I pledge to respect wildlife, never bait animals, avoid disturbing habitats, and support the preservation of our natural world.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Agree & Create Account
          </Button>
        </form>

        <div className="pt-4 border-t border-nature-border text-center text-xs text-nature-textMuted">
          <p>
            Already a member?{' '}
            <Link to="/login" className="text-nature-accent font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
