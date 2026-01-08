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

      {/* How this page works section */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">How this page works</h2>
                <p className="text-foreground/90 leading-relaxed">
                  All blog posts and other writings which you will see on this page are published to a distributed collection
                  of relays using the Nostr protocol. Unlike alternatives like Substack or Bear Blog, which store writings in
                  centralized servers where they can be tampered with or deleted, Nostr guarantees that (1) all content which
                  is under my "name" (public key) has been signed by my private key which only I have access to, and (2) the
                  hosting of the content is made redundant by publishing to a decentralized collection of relays.
                </p>
                <p className="text-foreground/90 leading-relaxed mt-4">
                  When you visit this page, your browser connects to multiple independent relays, and requests all content
                  under my public key. In contrast to standard clients like{' '}
                  <a
                    href="https://primal.net/home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Primal
                  </a>
                  , it will only display content under my public key, essentially making this page a personal blog where the
                  content is not hosted by me but instead independent relays.
                </p>
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
