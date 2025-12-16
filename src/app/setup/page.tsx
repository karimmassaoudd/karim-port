'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { MdPerson, MdEmail, MdLock, MdRocketLaunch } from 'react-icons/md';

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/setup/status');
      const data = await response.json();

      if (!data.needsSetup) {
        // Setup already completed, redirect to signin
        router.push('/auth/signin');
        return;
      }

      setLoading(false);
      
      // Animate entrance
      const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'power3.out',
        });

        gsap.from('.setup-card', {
          opacity: 0,
          y: 30,
          duration: 0.5,
          delay: 0.2,
          ease: 'power3.out',
        });

        gsap.from('.form-field', {
          opacity: 0,
          x: -20,
          stagger: 0.1,
          duration: 0.4,
          delay: 0.4,
          ease: 'power3.out',
        });
      });

      return () => ctx.revert();
    } catch (error) {
      console.error('Error checking setup status:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0] as any,
        duration: 0.4,
      });
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0] as any,
        duration: 0.4,
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/setup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Animate success
        gsap.to('.setup-card', {
          scale: 1.05,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });

        setTimeout(() => {
          router.push('/auth/signin');
        }, 1000);
      } else {
        setError(data.error || 'Setup failed');
        gsap.to(formRef.current, {
          x: [-10, 10, -10, 10, 0] as any,
          duration: 0.4,
        });
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0] as any,
        duration: 0.4,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking setup status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4">
      <div ref={containerRef} className="w-full max-w-md">
        <div className="setup-card bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-purple-100 dark:border-purple-900">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
              <MdRocketLaunch className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your admin account to get started
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 text-xl" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white border-2 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white border-2 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="admin@example.com"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 text-xl" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white border-2 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 text-xl" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white border-2 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Re-enter your password"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <MdRocketLaunch className="text-xl" />
                  <span>Create Admin Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>Important:</strong> This is a one-time setup. After creating your account, you'll sign in at <code className="px-1 py-0.5 bg-purple-200 dark:bg-purple-800 rounded">/admin</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
