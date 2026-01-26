import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLogo from '../../components/branding/AuthLogo';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-[#c9d1d9] font-display p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-4">
          <AuthLogo size={48} />
        </div>

        <h1 className="text-2xl text-center mb-6 text-[#e6edf3]">
          Create your account
        </h1>

        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Username
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

            <p className="text-xs text-[#8b949e] text-center pt-2">
              By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Statement</a>.
            </p>

            <button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-semibold py-2 rounded-md transition-colors">
              Create account
            </button>
          </form>


        </div>

        <div className="text-center mt-4 border border-[#30363d] rounded-lg p-4 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>.
        </div>
      </div>
    </div>
  );
};

export default Signup;
