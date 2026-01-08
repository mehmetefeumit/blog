import { useSeoMeta } from '@unhead/react';
import { useArticles } from '@/hooks/useArticles';
import { ArticleCard } from '@/components/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

// Your npub converted to hex
const AUTHOR_PUBKEY = 'f9cc6b4b5a4881e20e7588fd520a630d95a8f147f15c5e8610dc0ff62bb29c30';

const Blog = () => {
  const { data: articles, isLoading, error } = useArticles(AUTHOR_PUBKEY);

  useSeoMeta({
    title: 'Blog',
    description: 'Long-form essays and in-depth writing',
  });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Long-form essays and in-depth writing
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/40">
              <div className="relative h-48 overflow-hidden rounded-t-lg bg-muted" />
              <CardContent className="pt-6 pb-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
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
              Failed to load articles. Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Articles */}
      {articles && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} event={article} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {articles && articles.length === 0 && !isLoading && (
        <Card className="border-dashed border-2 border-border/60">
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-4">
              <div className="text-4xl opacity-20">📝</div>
              <p className="text-muted-foreground">
                No articles published yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Blog;
