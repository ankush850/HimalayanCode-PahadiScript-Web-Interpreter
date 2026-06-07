"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      
      if (data.ok) {
        loginUser(data.user);
        router.push('/editor');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-[420px] p-8 glass rounded-[24px]">
        <h1 className="text-4xl font-display font-normal text-black text-center mb-2">
          Register
        </h1>
        <p className="text-sm text-[#6F6F6F] text-center mb-8">
          Join us and start coding in the language of the mountains.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <label className="text-sm font-medium text-[#6F6F6F] mb-2 flex flex-col gap-1.5">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-black/10 text-[#000000] text-sm focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
              placeholder="Min 2 characters"
            />
          </label>

          <label className="text-sm font-medium text-[#6F6F6F] mb-2 flex flex-col gap-1.5">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-black/10 text-[#000000] text-sm focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
              placeholder="Min 6 characters"
            />
          </label>

          <label className="text-sm font-medium text-[#6F6F6F] mb-6 flex flex-col gap-1.5">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-black/10 text-[#000000] text-sm focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
              placeholder="Re-enter password"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full py-3 bg-black text-white hover:scale-[1.02] transition-transform active:scale-[0.98] font-medium text-sm disabled:opacity-50"
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-[#6F6F6F] text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-black underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
