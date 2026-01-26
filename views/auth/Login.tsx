import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../../context/AuthContext';
import AuthLogo from '../../components/branding/AuthLogo';
import OAuthButton from '../../components/auth/OAuthButton';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // OAuth handlers
  const handleGoogleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirect_uri: 'http://localhost:3000/auth/callback/google',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleGithubLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
      redirect_uri: 'http://localhost:3000/auth/callback/github',
      scope: 'read:user user:email',
      state
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };


  const handleSendOTP = async () => {
    if (!username) return setError("Please enter username (email) first.");
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setShowOTP(true);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, code: otpCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      // Use Context Login (assuming it handles setting user)
      // Or if context wrapper just expects a user object:
      login(data.user || { username, email: username });

    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showOTP) return handleVerifyOTP(e);

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { username, email: username, password });
      login(res.data.user, res.data.csrfToken);
    } catch (err: any) {
      // Keep any for now as api comes from AuthContext and might be axios
      if (err.response?.status === 401 && !err.response?.data?.error) {
        // Try OTP verify if standard login failed silently? 
        // actually let's just show the error, simpler is better for now.
        setError('Invalid credentials');
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-[#c9d1d9] font-display p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-4">
          <AuthLogo size={48} />
        </div>
        <h1 className="text-2xl text-center mb-6 text-[#e6edf3]">
          Sign in to TrackCodex
        </h1>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <OAuthButton
              provider="google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            />
            <OAuthButton
              provider="github"
              onClick={handleGithubLogin}
              disabled={isLoading}
            />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363d]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#161b22] text-[#8b949e]">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {showOTP ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-xs text-green-400">Code sent to your email!</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Enter 6-digit Code</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-center text-xl tracking-widest font-mono focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="username">
                    Username or email address
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      Password
                    </label>
                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // Not required if just wanting to use OTP link
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </>
            )}

            {error && <div className="text-xs text-red-500 text-center">{error}</div>}

            <button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-semibold py-2 rounded-md transition-colors">
              {isLoading ? "Processing..." : showOTP ? "Verify & Login" : "Sign in"}
            </button>

            {!showOTP && (
              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full bg-transparent hover:bg-[#21262d] text-[#c9d1d9] text-xs py-2 rounded-md transition-colors border border-dashed border-[#30363d]"
              >
                ✨ Login with Email Code
              </button>
            )}

          </form>


        </div>

        <div className="text-center mt-4 border border-[#30363d] rounded-lg p-4 text-sm">
          New to TrackCodex? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>.
        </div>

        <div className="text-center mt-4">
          <a href="#" className="text-primary hover:underline text-sm">Sign in with a passkey</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
