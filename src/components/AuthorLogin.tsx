import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { LogIn, LogOut, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AuthorLogin() {
  const { user } = useCurrentUser();
  const { loginNip07, logout } = useLoginActions();
  const [error, setError] = useState<string | null>(null);

  const isAuthor = user?.pubkey === AUTHOR_PUBKEY;

  const handleLogin = async () => {
    setError(null);
    
    try {
      await loginNip07();
      
      // Check if the logged-in user matches the author pubkey
      // We need to wait a bit for the user state to update
      setTimeout(() => {
        const currentUser = localStorage.getItem('nostr:login');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          if (userData.pubkey !== AUTHOR_PUBKEY) {
            setError('Access denied: This login is only for the blog owner.');
            logout();
          }
        }
      }, 500);
    } catch (err) {
      setError('Failed to connect to Nostr extension. Please make sure you have a Nostr extension installed.');
    }
  };

  const handleLogout = () => {
    logout();
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
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login with Nostr Extension
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
