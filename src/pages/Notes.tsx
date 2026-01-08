import { useSeoMeta } from '@unhead/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogPost } from '@/components/BlogPost';
import { CreateNote } from '@/components/CreateNote';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { pageContent } from '@/content/pages';

const Notes = () => {
  const { user } = useCurrentUser();
  const { data: posts, isLoading, error } = useBlogPosts(AUTHOR_PUBKEY);

  const isAuthor = user?.pubkey === AUTHOR_PUBKEY;

  useSeoMeta({
    title: pageContent.notes.title,
    description: pageContent.notes.subtitle,
  });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 font-mono text-primary">{pageContent.notes.title}</h1>
        <p className="text-muted-foreground">
          {pageContent.notes.subtitle}
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Create Note Form (only for author) */}
      {isAuthor && (
        <>
          <CreateNote />
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </>
      )}

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
              Failed to load notes. Please check your connection and try again.
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
                No notes found yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notes;
