"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleId {
  initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
  renderButton: (element: HTMLElement | null, options: { theme?: string; size?: string; width?: number; text?: string; shape?: string }) => void;
}

interface GoogleAuth {
  accounts: {
    id: GoogleId;
  };
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }

    const handleGoogleLoginSuccess = async (response: GoogleCredentialResponse) => {
      const idToken = response.credential;
      setGoogleLoading(true);
      setError('');
      
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: idToken }),
        });
        const data = await res.json();
        
        if (data.ok) {
          loginUser(data.user);
          router.push('/editor');
        } else {
          setError(data.error || 'Google sign-in failed');
        }
      } catch (err) {
        console.error('Google login error:', err);
        setError('A network error occurred. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    };

    const initializeGoogleButton = () => {
      const google = (window as unknown as { google?: GoogleAuth }).google;
      if (google) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLoginSuccess,
        });

        google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'outline', 
            size: 'large', 
            width: 356,
            text: 'signin_with',
            shape: 'pill'
          }
        );
      }
    };

    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi-script')) {
        initializeGoogleButton();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleButton();
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [router, loginUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Username and password are required');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      
      if (data.ok) {
        loginUser(data.user);
        router.push('/editor');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-[420px] p-8 glass rounded-[24px]">
        <h1 className="text-4xl font-display font-normal text-black text-center mb-2">
          Login
        </h1>
        <p className="text-sm text-[#6F6F6F] text-center mb-8">
          Welcome back to the mountain interpreter.
        </p>



        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}



        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-sm font-medium text-[#6F6F6F] mb-2 flex flex-col gap-1.5">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-black/10 text-[#000000] text-sm focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
              placeholder="Enter your username"
            />
          </label>

          <label className="text-sm font-medium text-[#6F6F6F] mb-6 flex flex-col gap-1.5">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-black/10 text-[#000000] text-sm focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
              placeholder="Enter your password"
            />
          </label>

          <button
            type="submit"
            disabled={submitting || googleLoading}
            className="rounded-full py-3 bg-black text-white hover:scale-[1.02] transition-transform active:scale-[0.98] font-medium text-sm disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <>
            <div className="flex items-center my-6 text-[#6F6F6F] text-xs">
              <div className="flex-1 border-t border-black/10"></div>
              <span className="px-3">or</span>
              <div className="flex-1 border-t border-black/10"></div>
            </div>

            <div className="flex justify-center w-full min-h-[44px]">
              <div id="google-signin-button" className="w-full flex justify-center"></div>
            </div>
          </>
        )}

        <p className="text-sm text-[#6F6F6F] text-center mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-black underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
