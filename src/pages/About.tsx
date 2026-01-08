import { useSeoMeta } from '@unhead/react';
import { useAuthor } from '@/hooks/useAuthor';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { genUserName } from '@/lib/genUserName';
import { AUTHOR_PUBKEY } from '@/lib/constants';

const About = () => {
  const author = useAuthor(AUTHOR_PUBKEY);

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
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                      <span className="font-semibold">Connects to relay servers</span> — Instead of a single server,
                      it connects to multiple independent relay servers that store Nostr events.
                    </li>
                    <li>
                      <span className="font-semibold">Requests my content</span> — It asks for all events signed by my
                      public key (<span className="font-mono text-xs text-primary break-all">{AUTHOR_PUBKEY.slice(0, 16)}...</span>).
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

              <section>
                <h3 className="text-xl font-bold mb-3">Why does this matter?</h3>
                <ul className="space-y-2 text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span><span className="font-semibold">Censorship-resistant:</span> No single entity can remove or alter my content.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span><span className="font-semibold">True ownership:</span> I control my identity and content with cryptographic keys, not usernames/passwords.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span><span className="font-semibold">Portable:</span> My content exists across multiple relays—if one goes down, others still serve it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span><span className="font-semibold">Open protocol:</span> Anyone can build clients, relays, or websites using Nostr. No platform lock-in.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3">Learn more about Nostr</h3>
                <div className="space-y-2">
                  <p className="text-foreground/90">
                    Interested in learning more about the Nostr protocol and how it works?
                  </p>
                  <ul className="space-y-2 text-foreground/90">
                    <li>
                      <a
                        href="https://nostr.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        nostr.com
                      </a>
                      {' '}— Introduction and getting started guide
                    </li>
                    <li>
                      <a
                        href="https://nostr.how"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        nostr.how
                      </a>
                      {' '}— Comprehensive guides and tutorials
                    </li>
                    <li>
                      <a
                        href="https://github.com/nostr-protocol/nostr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Protocol Specification
                      </a>
                      {' '}— Technical documentation on GitHub
                    </li>
                    <li>
                      <a
                        href="https://github.com/nostr-protocol/nips"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        NIPs (Nostr Implementation Possibilities)
                      </a>
                      {' '}— Protocol extensions and standards
                    </li>
                    <li>
                      <a
                        href="https://nostr.band"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        nostr.band
                      </a>
                      {' '}— Search and explore Nostr content
                    </li>
                  </ul>
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
