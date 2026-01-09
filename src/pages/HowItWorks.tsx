import { useSeoMeta } from '@unhead/react';
import { Card, CardContent } from '@/components/ui/card';
import { pageContent } from '@/content/pages';
import { howItWorksContent } from '@/content/howItWorks';

const HowItWorks = () => {
  useSeoMeta({
    title: pageContent.howItWorks.title,
  });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{pageContent.howItWorks.title}</h1>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Content */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section className="space-y-4">
                {howItWorksContent.paragraphs.map((paragraph, index) => {
                  // Replace NIP-23 with styled version
                  const parts = paragraph.split('NIP-23');

                  if (index === 1) {
                    return (
                      <p key={index} className="text-foreground/90 leading-relaxed">
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
                      </p>
                    );
                  }

                  if (parts.length > 1) {
                    return (
                      <p key={index} className="text-foreground/90 leading-relaxed">
                        {parts.map((part, i) => (
                          <span key={i}>
                            {part}
                            {i < parts.length - 1 && <span className="font-mono text-primary">NIP-23</span>}
                          </span>
                        ))}
                      </p>
                    );
                  }

                  return (
                    <p key={index} className="text-foreground/90 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </section>

              <section className="pt-6">
                <h3 className="text-xl font-bold mb-4">{howItWorksContent.whyNotSelfHost.heading}</h3>
                <div className="space-y-4">
                  {howItWorksContent.whyNotSelfHost.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-foreground/90 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  <ul className="space-y-3 mt-4">
                    {howItWorksContent.whyNotSelfHost.bulletPoints.map((point, index) => {
                      // Replace NIP-23 with styled version
                      const parts = point.split('NIP-23');

                      return (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-primary font-bold mt-1 shrink-0">•</span>
                          <span className="text-foreground/90 leading-relaxed">
                            {parts.map((part, i) => (
                              <span key={i}>
                                {part}
                                {i < parts.length - 1 && <span className="font-mono text-primary">NIP-23</span>}
                              </span>
                            ))}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>


            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowItWorks;
