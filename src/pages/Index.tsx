import { useSeoMeta } from '@unhead/react';
import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogPost } from '@/components/BlogPost';
import { LoginArea } from '@/components/auth/LoginArea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { genUserName } from '@/lib/genUserName';

const Index = () => {
  const { user } = useCurrentUser();
  const [customPubkey, setCustomPubkey] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Use custom pubkey if set, otherwise use logged-in user's pubkey
  const activePubkey = customPubkey || user?.pubkey || '';

  const author = useAuthor(activePubkey);
  const { data: posts, isLoading, error } = useBlogPosts(activePubkey);

  const displayName = author.data?.metadata?.display_name ||
                      author.data?.metadata?.name ||
                      (activePubkey ? genUserName(activePubkey) : 'Anonymous');

  const about = author.data?.metadata?.about;

  useSeoMeta({
    title: `${displayName}'s Blog`,
    description: about || 'A personal blog on Nostr',
  });

  const handleSetPubkey = () => {
    // Strip 'npub' prefix if present and convert to hex
    let pubkey = inputValue.trim();

    // Simple validation: check if it looks like a hex pubkey (64 chars)
    if (pubkey.length === 64) {
      setCustomPubkey(pubkey);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with subtle grid pattern */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                <span className="font-mono text-primary">/</span>
                {displayName}
              </h1>
              {about && (
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  {about}
                </p>
              )}
            </div>

            <LoginArea className="max-w-40" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-12">
        {/* Pubkey Input Section */}
        {!customPubkey && !user && (
          <Card className="mb-12 border-dashed border-2 border-border/60 bg-card/30">
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">View a Blog</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter a Nostr pubkey (hex format) to view someone's posts, or log in to view your own.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter pubkey (64-character hex)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleSetPubkey}
                    disabled={inputValue.trim().length !== 64}
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Section */}
        {activePubkey && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                Posts
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="border-border/40">
                    <CardContent className="pt-6 pb-6">
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm text-destructive">
                    Failed to load posts. Please check your connection and try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {posts && posts.length > 0 && (
              <div className="space-y-6">
                {posts.map((post) => (
                  <BlogPost key={post.id} event={post} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {posts && posts.length === 0 && !isLoading && (
              <Card className="border-dashed border-2 border-border/60">
                <CardContent className="py-12 px-8 text-center">
                  <div className="max-w-sm mx-auto space-y-4">
                    <div className="text-4xl opacity-20">✍️</div>
                    <p className="text-muted-foreground">
                      No posts found yet. Check your relay connections or try a different pubkey.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container max-w-3xl mx-auto px-4 py-8">
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
};

export default Index;
