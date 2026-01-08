import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import { AUTHOR_PUBKEY } from '@/lib/constants';

export function AuthorLogin() {
  const { user } = useCurrentUser();
  const loginActions = useLoginActions();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isAuthor = user?.pubkey === AUTHOR_PUBKEY;

  // Check if logged-in user is the author
  useEffect(() => {
    if (user && user.pubkey !== AUTHOR_PUBKEY) {
      setError('Access denied: This login is only for the blog owner.');
      loginActions.logout();
    }
  }, [user, loginActions]);

  const handleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);

    try {
      await loginActions.extension();
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to Nostr extension. Please make sure you have a Nostr extension installed (Alby, nos2x, etc.).');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    loginActions.logout();
    setError(null);
  };

  return (
    <div className="space-y-2">
      {!user && (
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono cursor-pointer disabled:opacity-50"
        >
          {isLoggingIn ? 'Connecting...' : 'Author login (blog owner only)'}
        </button>
      )}

      {user && !isAuthor && (
        <div className="space-y-1">
          <p className="text-xs text-destructive font-mono">
            Access denied
          </p>
          <button
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}

      {user && isAuthor && (
        <div className="space-y-1">
          <p className="text-xs text-primary font-mono">
            ✓ Logged in
          </p>
          <button
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
