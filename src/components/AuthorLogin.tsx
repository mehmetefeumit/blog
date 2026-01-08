import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { LogIn, LogOut, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
      <CardContent className="pt-4 pb-4">
        <div className="space-y-3">
          {!user && (
            <>
              <p className="text-xs text-muted-foreground font-mono">
                Author login (blog owner only)
              </p>
              <Button
                onClick={handleLogin}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isLoggingIn}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoggingIn ? 'Connecting...' : 'Login with Nostr Extension'}
              </Button>
            </>
          )}

          {user && !isAuthor && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Access denied: This login is only for the blog owner.
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}

          {user && isAuthor && (
            <>
              <p className="text-xs text-primary font-mono">
                ✓ Logged in as blog owner
              </p>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
