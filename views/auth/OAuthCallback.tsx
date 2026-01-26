import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, api } from '../../context/AuthContext';

const OAuthCallback: React.FC = () => {
    const { provider } = useParams<{ provider: 'google' | 'github' }>();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get authorization code from URL
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const state = params.get('state');
                const error = params.get('error');

                // Check for OAuth errors
                if (error) {
                    throw new Error(`OAuth error: ${error}`);
                }

                if (!code) {
                    throw new Error('No authorization code received');
                }

                // Verify state to prevent CSRF
                const savedState = localStorage.getItem('oauth_state');
                if (state !== savedState) {
                    throw new Error('Invalid state parameter');
                }

                // Clear saved state
                localStorage.removeItem('oauth_state');

                // Exchange code for session with backend
                const response = await api.post(`/auth/${provider}`, { code });

                // Update auth context (cookie handles session, we just need csrf token)
                const data = response.data;
                login(data.user, data.csrfToken);

                // Clear any manual token storage (legacy cleanup)
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');

                // Redirect to dashboard
                navigate('/dashboard');

            } catch (err) {
                const error = err as Error;
                console.error('OAuth callback error:', error);
                setError(error.message || 'Authentication failed');
                setIsProcessing(false);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        handleCallback();
    }, [provider, navigate, login]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-[#c9d1d9]">
                <div className="bg-[#161b22] border border-red-500 rounded-lg p-8 max-w-md text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h1 className="text-xl font-bold mb-2 text-red-400">Authentication Failed</h1>
                    <p className="text-[#8b949e] mb-4">{error}</p>
                    <p className="text-sm text-[#8b949e]">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-[#c9d1d9]">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 max-w-md text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                <h1 className="text-xl font-bold mb-2">Completing Sign In</h1>
                <p className="text-[#8b949e]">
                    Authenticating with {provider === 'google' ? 'Google' : 'GitHub'}...
                </p>
            </div>
        </div>
    );
};

export default OAuthCallback;
