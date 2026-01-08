import { useSeoMeta } from '@unhead/react';
import { Card, CardContent } from '@/components/ui/card';
import { pageContent } from '@/content/pages';
import { howItWorksContent } from '@/content/howItWorks';

const HowItWorks = () => {
  useSeoMeta({
    title: pageContent.howItWorks.title,
    description: pageContent.howItWorks.subtitle,
  });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{pageContent.howItWorks.title}</h1>
        <p className="text-muted-foreground">
          {pageContent.howItWorks.subtitle}
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Content */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section>
                {howItWorksContent.paragraphs.map((paragraph, index) => (
                  <p key={index} className={`text-foreground/90 leading-relaxed ${index > 0 ? 'mt-4' : ''}`}>
                    {index === 1 ? (
                      <>
                        When you visit this page, your browser connects to multiple independent relays, and requests all content
                        under my public key. In contrast to standard clients like{' '}
                        <a
                          href={howItWorksContent.primalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Primal
                        </a>
                        , it will only display content under my public key, essentially making this page a personal blog where the
                        content is not hosted by me but instead independent relays.
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </section>

              <section className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground italic">
                  This website is built with{' '}
                  <a
                    href={howItWorksContent.attribution.shakespeareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Shakespeare
                  </a>
                  , an AI-powered development tool, and uses the Nostr protocol for content distribution.
                </p>
              </section>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowItWorks;
