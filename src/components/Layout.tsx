import { Link, useLocation } from 'react-router-dom';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { cn } from '@/lib/utils';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { AuthorLogin } from '@/components/AuthorLogin';
import { Nip05Badge } from '@/components/Nip05Badge';
import { NpubBadge } from '@/components/NpubBadge';
import { RelayBanner } from '@/components/RelayBanner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AUTHOR_NPUB = 'npub17pdf8saz8fflz3dqyst8rhfzav4s922yv0truw85nr02jxyxqr3shkl0gr';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const author = useAuthor(AUTHOR_PUBKEY);

  const displayName = author.isLoading
    ? 'loading...'
    : (author.data?.metadata?.display_name ||
       author.data?.metadata?.name ||
       genUserName(AUTHOR_PUBKEY));

  const profileImage = author.data?.metadata?.picture;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Relay Status Banner */}
      <RelayBanner />

      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="mb-4 flex items-start gap-4">
            {/* Profile Picture */}
            <Avatar className="h-20 w-20 border-2 border-primary/20 shrink-0">
              <AvatarImage src={profileImage} alt={displayName} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Identity Info */}
            <div className="space-y-1">
              <h1 className={`text-2xl font-bold tracking-tight ${
                author.isLoading ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                <span className="font-mono text-primary">/</span>
                <span className="ml-1">{displayName}</span>
              </h1>
              <div className="space-y-0.5">
                <Nip05Badge nip05="efe@nostrpurple.com" pubkey={AUTHOR_PUBKEY} />
                <NpubBadge npub={AUTHOR_NPUB} />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1">
            <Link
              to="/"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/') && location.pathname === '/'
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Writings
            </Link>
            <Link
              to="/how-it-works"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/how-it-works')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              How This Page Works
            </Link>
            <Link
              to="/cv"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/cv')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              CV
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8 items-center">
            <div>
              <p className="text-xs text-muted-foreground">
                <a
                  href="https://creativecommons.org/publicdomain/zero/1.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  CC0 1.0 Universal
                </a>
                {' '}— All content signed with the private key corresponding to my public key is released into the public domain.
              </p>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Built with{' '}
              <a
                href="https://shakespeare.diy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Shakespeare
              </a>
            </div>
            <div className="flex justify-end">
              <AuthorLogin />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
