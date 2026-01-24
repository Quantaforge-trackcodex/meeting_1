import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (data: any, provider?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fix: Changed component props to use React.PropsWithChildren to correctly type a component that accepts children. This resolves the TypeScript error in App.tsx.
export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('trackcodex_token');
    if (token) {
      setIsAuthenticated(true);
      setUser({ username: 'alexcoder' }); // Mock user
    }
    setIsLoading(false);
  }, []);

  const login = (data: any, provider?: string) => {
    localStorage.setItem('trackcodex_token', 'dummy-token');

    // Auto-connect GitHub integration if logging in via GitHub
    if (provider === 'github') {
      const integrations = [
        { id: 'github', name: 'GitHub', description: 'Sync repositories, issues, and pull requests.', icon: 'code', connected: true, color: 'text-white' },
        { id: 'gitlab', name: 'GitLab', description: 'Connect your GitLab projects and CI/CD pipelines.', icon: 'code_blocks', connected: false, color: 'text-orange-500' },
        // ... preserve others default state
        { id: 'forgebrowser', name: 'ForgeBrowser', description: 'Enable deep context search across web resources.', icon: 'travel_explore', connected: true, color: 'text-cyan-400' },
        { id: 'quantalab', name: 'QuantaLab', description: 'Unified lab environment for AI experiments.', icon: 'science', connected: false, color: 'text-purple-400' },
        { id: 'quantacode', name: 'QuantaCode', description: 'Advanced code analysis and refactoring engine.', icon: 'code_off', connected: true, color: 'text-emerald-400' }
      ];
      localStorage.setItem('trackcodex_integrations', JSON.stringify(integrations));

      // Also simulate an auto-sync notification
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('trackcodex-notification', {
          detail: { title: 'GitHub Connected', message: 'Your repositories are syncing automatically.', type: 'success' }
        }));
      }, 1000);
    }

    setIsAuthenticated(true);
    setUser({ username: 'alexcoder', provider: provider || 'email' });
    navigate('/dashboard/home');
  };

  const logout = () => {
    localStorage.removeItem('trackcodex_token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};