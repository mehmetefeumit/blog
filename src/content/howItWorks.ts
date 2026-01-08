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
    paragraphs: [
      `I've always wanted to have a personal page where I could put my ideas, learnings, and thoughts into writing, and share them with friends and family, or just make them available to the world. Over the past 2 years, I've been interested in Nostr and its potential to be the identity protocol of the internet. But in order for Nostr to succeed, the applications and content on it should offer a level of quality that is becoming harder to come by in the modern internet. So that's the primary reason of this Nostr integration in my blog: ensuring that the work I'll put a lot of energy and thought into also enriches the protocol which I support as a building block of the future internet.`,

      `In addition to that, there are other perks:`,
    ],
    bulletPoints: [
      `If this website goes down for some reason, my posts are still accessible through many other Nostr clients. I do not lose anything.`,

      `All of the content on this website will have been signed by my private key. Anyone can look at the source code or check out my content through other Nostr clients to confirm that. This is in contrast with other hosted solutions like Substack and Bear Blog which, while great products, do not offer the same level of identity confirmation.`,

      `Nostr is interoperable. If you start reading something on this website, you can continue reading it on another client, since my public key is always the same irrespective of what client you are using. So it is more convenient for the reader too.`,
    ],
  },

  // Link to Primal (or change to another client)
  primalLink: "https://primal.net/home",

  // Attribution footer
  attribution: {
    text: "This website is built with Shakespeare, an AI-powered development tool, and uses the Nostr protocol for content distribution.",
    shakespeareLink: "https://shakespeare.diy",
  },
};
