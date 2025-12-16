'use client';
import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff, MdArrowBack } from 'react-icons/md';
import LightRays from '@/components/LightRays';
import MantisLoader from '@/components/MantisLoader';
import ThemeToggle from '@/components/ThemeToggle';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/setup/status');
      const data = await response.json();

      if (data.needsSetup) {
        setSetupMode(true);
        setMode('signup');
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
    } finally {
      setCheckingSetup(false);
    }
  };

  const flipCard = (newMode: 'signin' | 'signup' | 'forgot') => {
    setIsFlipping(true);
    setError('');
    setSuccess('');
    setTimeout(() => {
      setMode(newMode);
      setIsFlipping(false);
    }, 800); // Complete flip animation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const response = await fetch(setupMode ? '/api/setup/create' : '/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (data.success) {
          // Auto sign in after signup
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });

          if (result?.ok) {
            router.push('/admin/dashboard');
          } else {
            setError('Account created but sign in failed. Please sign in manually.');
            flipCard('signin');
          }
        } else {
          setError(data.error || 'Registration failed');
        }
      } else if (mode === 'signin') {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/admin/dashboard');
        }
      } else if (mode === 'forgot') {
        // Handle forgot password
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
          setSuccess('Password reset link sent to your email!');
          setTimeout(() => flipCard('signin'), 2000);
        } else {
          setError(data.error || 'Failed to send reset link');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return <MantisLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[var(--background)] to-[var(--card)]">
      {/* Background with Advanced WebGL LightRays */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.8}
          lightSpread={0.6}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.05}
          distortion={0.03}
          pulsating={true}
          fadeDistance={1.2}
          saturation={0.9}
          className="opacity-50 dark:opacity-70"
        />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[var(--accent)]/20 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Card Container with Flip Animation */}
      <div className="relative w-full max-w-lg perspective-1000 z-20">
        <div 
          className={`relative transform-style-3d transition-transform duration-[800ms] ease-in-out ${
            mode !== 'signin' ? 'rotate-y-180' : 'rotate-y-0'
          }`}
        >
          {/* Glossy Card - Apply counter-rotation when flipped */}
          <div 
            className={`relative backdrop-blur-2xl bg-white/10 dark:bg-white/5 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-6 sm:p-8 overflow-hidden ${
              mode !== 'signin' ? 'rotate-y-180' : ''
            }`}
            style={{
              transform: mode !== 'signin' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Theme Toggle - Top Left */}
            <div className="absolute top-4 left-4 z-20">
              <ThemeToggle />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/10 border border-[var(--accent)]/20 mb-3">
                  <MdLock className="text-2xl text-[var(--accent)]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--headline)] mb-2">
                  {mode === 'signin' && (setupMode ? 'Initial Setup' : 'Welcome Back')}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Reset Password'}
                </h3>
                <p className="text-sm text-[var(--text)]/70">
                  {mode === 'signin' && (setupMode ? 'Set up your admin account' : 'Sign in to your account')}
                  {mode === 'signup' && 'Fill in your details to get started'}
                  {mode === 'forgot' && 'Enter your email to receive a reset link'}
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                  <p className="text-sm text-green-600 dark:text-green-400 text-center">{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--headline)]">Full Name</label>
                    <div className="relative">
                      <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-xl" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20 outline-none text-[var(--headline)] placeholder:text-[var(--text)]/40 transition-all backdrop-blur-sm"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--headline)]">Email Address</label>
                  <div className="relative">
                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-xl" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20 outline-none text-[var(--headline)] placeholder:text-[var(--text)]/40 transition-all backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--headline)]">Password</label>
                    <div className="relative">
                      <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-xl" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20 outline-none text-[var(--headline)] placeholder:text-[var(--text)]/40 transition-all backdrop-blur-sm"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text)]/60 hover:text-[var(--accent)] transition-colors"
                      >
                        {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--headline)]">Confirm Password</label>
                    <div className="relative">
                      <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)] text-xl" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20 outline-none text-[var(--headline)] placeholder:text-[var(--text)]/40 transition-all backdrop-blur-sm"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}

                {mode === 'signin' && !setupMode && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => flipCard('forgot')}
                      className="text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-white font-semibold hover:shadow-lg hover:shadow-[var(--accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      {mode === 'signin' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </>
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-5 text-center space-y-2">
                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => flipCard('signin')}
                    className="flex items-center justify-center gap-2 w-full text-sm text-[var(--text)]/70 hover:text-[var(--accent)] transition-colors"
                  >
                    <MdArrowBack />
                    Back to Sign In
                  </button>
                )}

                {mode === 'signin' && !setupMode && (
                  <p className="text-sm text-[var(--text)]/70">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => flipCard('signup')}
                      className="text-[var(--accent)] hover:text-[var(--accent)]/80 font-semibold transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                )}

                {mode === 'signup' && !setupMode && (
                  <p className="text-sm text-[var(--text)]/70">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => flipCard('signin')}
                      className="text-[var(--accent)] hover:text-[var(--accent)]/80 font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--card)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)]/30 border-t-[var(--accent)]"></div>
          </div>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
