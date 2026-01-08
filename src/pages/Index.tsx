import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { useAuthor } from '@/hooks/useAuthor';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useArticles } from '@/hooks/useArticles';
import { genUserName } from '@/lib/genUserName';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

// Your npub converted to hex
const AUTHOR_PUBKEY = 'f9cc6b4b5a4881e20e7588fd520a630d95a8f147f15c5e8610dc0ff62bb29c30';

const Index = () => {
  const author = useAuthor(AUTHOR_PUBKEY);
  const { data: posts } = useBlogPosts(AUTHOR_PUBKEY);
  const { data: articles } = useArticles(AUTHOR_PUBKEY);

  const displayName = author.data?.metadata?.display_name ||
                      author.data?.metadata?.name ||
                      genUserName(AUTHOR_PUBKEY);

  const about = author.data?.metadata?.about;

  useSeoMeta({
    title: `${displayName}`,
    description: about || 'Personal blog and portfolio on Nostr',
  });

  const recentPosts = posts?.slice(0, 3) || [];
  const recentArticles = articles?.slice(0, 2) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="inline-block">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="font-mono text-primary text-3xl md:text-4xl">/</span>
                {displayName}
              </h1>
            </div>

            {about && (
              <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                {about}
              </p>
            )}

            <div className="flex gap-4 justify-center pt-4">
              <Button asChild size="lg" className="group">
                <Link to="/notes">
                  View Notes
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">About Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {posts?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                Notes
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                {articles?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                Articles
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/30 backdrop-blur-sm col-span-2 md:col-span-1">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                ∞
              </div>
              <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                On Nostr
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Content Sections */}
      <div className="space-y-16 py-12">
        {/* Recent Notes */}
        {recentPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Notes</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/notes" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {recentPosts.map((post) => {
                const date = new Date(post.created_at * 1000);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <Card key={post.id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex gap-4">
                        <time className="text-xs font-mono text-muted-foreground shrink-0 pt-1">
                          {formattedDate}
                        </time>
                        <p className="text-foreground/90 line-clamp-2 text-sm">
                          {post.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent Articles */}
        {recentArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Articles</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/articles" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentArticles.map((article) => {
                const title = article.tags.find(([name]) => name === 'title')?.[1] || 'Untitled';
                const summary = article.tags.find(([name]) => name === 'summary')?.[1];

                return (
                  <Card key={article.id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all">
                    <CardHeader>
                      <h3 className="text-lg font-bold">{title}</h3>
                    </CardHeader>
                    {summary && (
                      <CardContent className="pb-6">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {summary}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Index;
