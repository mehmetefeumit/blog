import type { NostrEvent } from '@nostrify/nostrify';
import { NoteContent } from '@/components/NoteContent';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPostProps {
  event: NostrEvent;
}

export function BlogPost({ event }: BlogPostProps) {
  const date = new Date(event.created_at * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-colors">
      <CardContent className="pt-6 pb-6">
        <article className="space-y-4">
          <time className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            {formattedDate}
          </time>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
              <NoteContent event={event} className="text-base" />
            </div>
          </div>
        </article>
      </CardContent>
    </Card>
  );
}
