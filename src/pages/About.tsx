import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { useAuthor } from '@/hooks/useAuthor';
import { Card, CardContent } from '@/components/ui/card';
import { genUserName } from '@/lib/genUserName';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { aboutContent } from '@/content/about';

const About = () => {
  const author = useAuthor(AUTHOR_PUBKEY);

  const displayName = author.isLoading
    ? 'loading...'
    : (author.data?.metadata?.display_name ||
       author.data?.metadata?.name ||
       genUserName(AUTHOR_PUBKEY));
  const profileImage = author.data?.metadata?.picture;

  useSeoMeta({
    title: aboutContent.title,
    description: aboutContent.subtitle,
  });

  return (
    <div className="space-y-8">
      {/* Content */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-4 text-foreground/90 leading-relaxed">
            {aboutContent.paragraphs.map((para, index) => {
              // Parse NIP-23
              let text = para.text
                .replace(/\(NIP-23\)/g, '(<span class="font-mono text-primary">NIP-23</span>)');

              // Handle How It Works link
              if (para.links.howItWorks) {
                text = text.replace('{howItWorks}', `<a href="${para.links.howItWorks}" class="text-primary hover:underline">How It Works</a>`);
              }

              // Handle Shakespeare link
              if (para.links.shakespeare) {
                text = text.replace('{shakespeare}', `<a href="${para.links.shakespeare}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Shakespeare.diy</a>`);
              }

              return (
                <p key={index} dangerouslySetInnerHTML={{ __html: text }} />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
