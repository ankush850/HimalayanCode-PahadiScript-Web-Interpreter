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
  
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const { loginUser } = useAuth();
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setError('');
    setOtpSending(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      
      if (data.ok) {
        setOtpSent(true);
      } else {
        setError(data.error || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('OTP Send error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setError('');
    setOtpVerifying(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: otpCode.trim() }),
      });
      const data = await res.json();
      
      if (data.ok) {
        loginUser(data.user);
        router.push('/editor');
      } else {
        setError(data.error || 'Invalid or expired verification code.');
      }
    } catch (err) {
      console.error('OTP Verify error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setOtpVerifying(false);
    }
  };

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

        <div className="flex border-b border-black/5 mb-6 text-sm">
          <button
            type="button"
            onClick={() => { setLoginMode('password'); setError(''); }}
            disabled={submitting || googleLoading || otpSending || otpVerifying}
            className={`flex-1 pb-3 text-center font-medium transition-colors cursor-pointer ${loginMode === 'password' ? 'border-b-2 border-black text-black font-semibold' : 'text-[#6F6F6F] hover:text-black'}`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('otp'); setError(''); }}
            disabled={submitting || googleLoading || otpSending || otpVerifying}
            className={`flex-1 pb-3 text-center font-medium transition-colors cursor-pointer ${loginMode === 'otp' ? 'border-b-2 border-black text-black font-semibold' : 'text-[#6F6F6F] hover:text-black'}`}
          >
            Email OTP
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}



        {loginMode === 'password' ? (
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
        ) : (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="flex flex-col">
              <label className="text-sm font-medium text-[#6F6F6F] mb-6 flex flex-col gap-1.5">
                Email Address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSending}
                  className="px-4 py-2.5 rounded-xl border border-black/10 text-[#000000] text-sm focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={otpSending || googleLoading}
                className="rounded-full py-3 bg-black text-white hover:scale-[1.02] transition-transform active:scale-[0.98] font-medium text-sm disabled:opacity-50 cursor-pointer"
              >
                {otpSending ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col">
              <div className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg p-3 mb-4 text-center">
                A verification code has been sent to <strong>{email}</strong>.
              </div>

              <label className="text-sm font-medium text-[#6F6F6F] mb-6 flex flex-col gap-1.5">
                Verification Code
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  disabled={otpVerifying}
                  maxLength={6}
                  className="px-4 py-2.5 rounded-xl border border-black/10 text-[#000000] text-center text-lg tracking-[8px] font-semibold focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                  placeholder="123456"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={otpVerifying || googleLoading}
                className="rounded-full py-3 bg-black text-white hover:scale-[1.02] transition-transform active:scale-[0.98] font-medium text-sm disabled:opacity-50 cursor-pointer"
              >
                {otpVerifying ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || otpVerifying}
                className="text-xs text-[#6F6F6F] hover:text-black underline mt-4 text-center font-medium disabled:opacity-50 cursor-pointer"
              >
                {otpSending ? 'Resending Code...' : 'Resend Code'}
              </button>
            </form>
          )
        )}

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
