import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TrackCodexLogo from '../../components/branding/TrackCodexLogo';

const Signup = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup then login
    login({ username, email });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#24292f] font-display p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-6">
          <TrackCodexLogo size="md" collapsed={false} clickable={false} />
        </div>
        
        <h1 className="text-2xl text-center mb-4 font-semibold">Sign up for TrackCodex</h1>
        
        <div className="space-y-3 mb-4">
          <button className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="size-4" />
            Continue with Google
          </button>
          <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8.28,2.25a2.76,2.76,0,0,0-2.8,2.73c0,2.1,1.82,3.22,3.52,3.22s3.52-1.12,3.52-3.22a2.76,2.76,0,0,0-2.8-2.73m.11,1.19a1.59,1.59,0,0,1,1.71,1.55,1.57,1.57,0,0,1-1.71,1.55,1.58,1.58,0,0,1-1.71-1.55A1.59,1.59,0,0,1,8.39,3.44"/><path d="M12.42,14S10.26,8.71,8,8.71s-4.42,5.3-4.42,5.3a4,4,0,1,0,8.84,0"/></svg>
            Continue with Apple
          </button>
        </div>
        
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Password should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username<span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.</p>
          </div>
          
          <div className="pt-2">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-700">Receive occasional product updates and announcements</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-[#24292f] hover:bg-[#343a40] text-white font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2">
            Create account
            <span className="material-symbols-outlined !text-sm">arrow_forward</span>
          </button>

          <p className="text-xs text-gray-500 text-center pt-2">
            By creating an account, you agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>. For more information about TrackCodex's privacy practices, see the <a href="#" className="text-blue-600 hover:underline">TrackCodex Privacy Statement</a>.
          </p>
        </form>
        
        <div className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>.
        </div>
      </div>
    </div>
  );
};

export default Signup;