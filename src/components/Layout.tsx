import { Link, useLocation } from 'react-router-dom';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { cn } from '@/lib/utils';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { AuthorLogin } from '@/components/AuthorLogin';
import { Nip05Badge } from '@/components/Nip05Badge';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const author = useAuthor(AUTHOR_PUBKEY);

  const displayName = author.data?.metadata?.display_name ||
                      author.data?.metadata?.name ||
                      genUserName(AUTHOR_PUBKEY);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="group">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  <span className="font-mono text-primary">/</span>
                  <span className="ml-1">{displayName}</span>
                </h1>
                <Nip05Badge nip05="efe@nostrpurple.com" pubkey={AUTHOR_PUBKEY} />
              </div>
            </Link>
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
              About
            </Link>
            <Link
              to="/blog"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/blog')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Blog
            </Link>
            <Link
              to="/notes"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/notes')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Notes
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
      <main className="container max-w-4xl mx-auto px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-mono">
                Powered by <span className="text-primary">Nostr</span>
              </p>
            </div>
            <div className="w-64">
              <AuthorLogin />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
