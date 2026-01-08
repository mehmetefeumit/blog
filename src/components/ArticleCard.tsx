import type { NostrEvent } from '@nostrify/nostrify';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';

interface ArticleCardProps {
  event: NostrEvent;
}

export function ArticleCard({ event }: ArticleCardProps) {
  const date = new Date(event.created_at * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Extract metadata from tags
  const title = event.tags.find(([name]) => name === 'title')?.[1] || 'Untitled';
  const summary = event.tags.find(([name]) => name === 'summary')?.[1];
  const image = event.tags.find(([name]) => name === 'image')?.[1];
  const dTag = event.tags.find(([name]) => name === 'd')?.[1];

  // Create naddr for linking
  const naddr = dTag ? nip19.naddrEncode({
    kind: event.kind,
    pubkey: event.pubkey,
    identifier: dTag,
  }) : null;

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
      {image && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="space-y-2">
          <time className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            {formattedDate}
          </time>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {naddr ? (
              <Link to={`/${naddr}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
        </div>
      </CardHeader>
      {summary && (
        <CardContent className="pb-6">
          <p className="text-muted-foreground line-clamp-3">
            {summary}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
