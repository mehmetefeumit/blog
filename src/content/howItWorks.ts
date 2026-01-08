/**
 * "How It Works" Page Content
 *
 * Edit this file to update the content on the How It Works page.
 * No coding knowledge required - just edit the text between the backticks.
 */

export const howItWorksContent = {
  // Main explanation paragraphs
  paragraphs: [
    `All blog posts and other writings which you will see on this page are published to a distributed collection
of relays using the Nostr protocol. Unlike alternatives like Substack or Bear Blog, which store writings in
centralized servers where they can be tampered with or deleted, Nostr guarantees that (1) all content which
is under my "name" (public key) has been signed by my private key which only I have access to, and (2) the
hosting of the content is made redundant by publishing to a decentralized collection of relays.`,

    `When you visit this page, your browser connects to multiple independent relays, and requests all content
under my public key. In contrast to standard clients like Primal, it will only display content under my public key,
essentially making this page a personal blog where the content is not hosted by me but instead independent relays.`,
  ],

  // Why not self-host section
  whyNotSelfHost: {
    heading: "Why not just host everything myself?",
    content: `[Add your explanation here about why you choose Nostr over traditional self-hosting.
You might discuss: censorship resistance, no single point of failure, portability of your identity and content,
reduced maintenance burden, or the benefits of decentralized infrastructure.]`,
  },

  // Link to Primal (or change to another client)
  primalLink: "https://primal.net/home",

  // Attribution footer
  attribution: {
    text: "This website is built with Shakespeare, an AI-powered development tool, and uses the Nostr protocol for content distribution.",
    shakespeareLink: "https://shakespeare.diy",
  },
};
