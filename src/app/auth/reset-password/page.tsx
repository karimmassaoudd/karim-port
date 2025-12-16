'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power3.out',
      });

      gsap.from('.form-field', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2,
      });
    });

    return () => ctx.revert();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      gsap.to(formRef.current, {
        x: -10,
        yoyo: true,
        repeat: 3,
        duration: 0.1,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error);
        gsap.to(formRef.current, {
          x: -10,
          yoyo: true,
          repeat: 3,
          duration: 0.1,
        });
      } else {
        setSuccess(true);
        gsap.fromTo('.success-message',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 }
        );
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdLock className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your new password
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 form-field">
            {error}
          </div>
        )}

        {success ? (
          <div className="success-message text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Password Reset Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Redirecting to sign in...
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="text-xl" />
                  ) : (
                    <MdVisibility className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="form-field w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="form-field text-center">
              <Link
                href="/auth/signin"
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ← Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
