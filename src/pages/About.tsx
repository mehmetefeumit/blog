import { useSeoMeta } from '@unhead/react';
import { useAuthor } from '@/hooks/useAuthor';
import { useAppContext } from '@/hooks/useAppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { genUserName } from '@/lib/genUserName';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { nip19 } from 'nostr-tools';

const AUTHOR_NPUB = 'npub17pdf8saz8fflz3dqyst8rhfzav4s922yv0truw85nr02jxyxqr3shkl0gr';

const About = () => {
  const author = useAuthor(AUTHOR_PUBKEY);
  const { config } = useAppContext();

  const displayName = author.data?.metadata?.display_name ||
                      author.data?.metadata?.name ||
                      genUserName(AUTHOR_PUBKEY);
  const profileImage = author.data?.metadata?.picture;

  useSeoMeta({
    title: 'About',
    description: 'Learn more about me',
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
          <h1 className="text-3xl font-bold mb-2">About</h1>
          <p className="text-muted-foreground">
            Who I am and what I do
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Content */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">Who I Am</h2>
                <p className="text-foreground/90 leading-relaxed">
                  [Your introduction goes here. Tell visitors about yourself, your background,
                  and what drives you. This is your space to share your story.]
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">What I Do</h2>
                <p className="text-foreground/90 leading-relaxed">
                  [Describe your work, your interests, and your projects. What are you passionate about?
                  What kind of content do you create? What problems are you trying to solve?]
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">My Journey</h2>
                <p className="text-foreground/90 leading-relaxed">
                  [Share your journey so far. How did you get here? What experiences shaped you?
                  What are you working towards?]
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Connect</h2>
                <p className="text-foreground/90 leading-relaxed">
                  [Add your contact information, social links, or ways people can reach you.
                  You can also mention what kind of conversations or collaborations you're open to.]
                </p>
              </section>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What is this page section */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">What is this page?</h2>
                <p className="text-foreground/90 leading-relaxed">
                  This website is powered by <span className="font-semibold text-primary">Nostr</span> (Notes and Other Stuff
                  Transmitted by Relays)—a decentralized protocol for publishing and distributing content. Unlike traditional
                  websites that store content on centralized servers, this site fetches content directly from a network of
                  relay servers using cryptographic signatures.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3">What's happening in your browser?</h3>
                <div className="space-y-3 text-foreground/90">
                  <p>When you visit this page, your browser:</p>
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>
                      <span className="font-semibold">Connects to relay servers</span> — Instead of a single server,
                      it connects to multiple independent relay servers:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                        {config.relayMetadata.relays.map((relay) => (
                          <li key={relay.url}>
                            <code className="text-xs text-primary">{relay.url}</code>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <span className="font-semibold">Requests my content</span> — It asks for all events signed by my
                      public key (<span className="font-mono text-xs text-primary break-all">{AUTHOR_NPUB}</span>).
                    </li>
                    <li>
                      <span className="font-semibold">Verifies cryptographic signatures</span> — Each post is cryptographically
                      signed with my private key, proving I'm the author and the content hasn't been tampered with.
                    </li>
                    <li>
                      <span className="font-semibold">Displays the content</span> — Once verified, it renders the posts you see.
                      No middleman can censor, modify, or delete them.
                    </li>
                  </ol>
                </div>
              </section>

              <section className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground italic">
                  This website is built with{' '}
                  <a
                    href="https://shakespeare.diy"
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

export default About;
