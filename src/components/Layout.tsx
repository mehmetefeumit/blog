import { Link, useLocation } from 'react-router-dom';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { cn } from '@/lib/utils';

// Your npub converted to hex
const AUTHOR_PUBKEY = 'f9cc6b4b5a4881e20e7588fd520a630d95a8f147f15c5e8610dc0ff62bb29c30';

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
              <h1 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                <span className="font-mono text-primary">/</span>
                {displayName}
              </h1>
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
              Home
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
              to="/articles"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/articles')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Articles
            </Link>
            <Link
              to="/about"
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive('/about')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              About
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
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p className="font-mono">
              Powered by <span className="text-primary">Nostr</span>
            </p>
            <a 
              href="https://shakespeare.diy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-mono"
            >
              Vibed with Shakespeare
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
