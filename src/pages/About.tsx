import { useSeoMeta } from '@unhead/react';
import { useAuthor } from '@/hooks/useAuthor';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
      {/* Section Header with Profile Picture */}
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24 border-2 border-primary/20 shrink-0">
          <AvatarImage src={profileImage} alt={displayName} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="pt-2">
          <h1 className="text-3xl font-bold mb-2">{aboutContent.title}</h1>
          <p className="text-muted-foreground">
            {aboutContent.subtitle}
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Content */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="space-y-6">
              {aboutContent.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
                  <p className="text-foreground/90 leading-relaxed">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
