import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { emitDiagnostic } from '@/components/DiagnosticPanel';

interface ArticleViewerProps {
  kind: number;
  pubkey: string;
  identifier: string;
}

export function ArticleViewer({ kind, pubkey, identifier }: ArticleViewerProps) {
  const { nostr } = useNostr();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['article', pubkey, identifier],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);

      emitDiagnostic(`Fetching article: ${identifier}`, 'info');

      const events = await nostr.query(
        [
          {
            kinds: [kind],
            authors: [pubkey],
            '#d': [identifier],
            limit: 1,
          },
        ],
        { signal }
      );

      if (events.length === 0) {
        emitDiagnostic('Article not found', 'error');
        throw new Error('Article not found');
      }

      emitDiagnostic('Article loaded successfully', 'success');
      return events[0];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-border/40">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6 pb-6">
          <p className="text-sm text-destructive">
            Article not found. It may have been deleted or the identifier is incorrect.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract metadata from tags
  const title = event.tags.find(([name]) => name === 'title')?.[1] || 'Untitled';
  const summary = event.tags.find(([name]) => name === 'summary')?.[1];
  const image = event.tags.find(([name]) => name === 'image')?.[1];
  const publishedAt = event.tags.find(([name]) => name === 'published_at')?.[1];

  const date = publishedAt
    ? new Date(parseInt(publishedAt) * 1000)
    : new Date(event.created_at * 1000);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="space-y-3">
            <time className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
              {formattedDate}
            </time>
            <h1 className="text-4xl font-bold text-foreground">
              {title}
            </h1>
            {summary && (
              <p className="text-lg text-muted-foreground">
                {summary}
              </p>
            )}
          </div>
        </CardHeader>

        {image && (
          <div className="px-6">
            <img
              src={image}
              alt={title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        <CardContent className="pt-6">
          <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-p:mb-6 prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-hr:border-border/40">
            <ReactMarkdown>{event.content}</ReactMarkdown>
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
