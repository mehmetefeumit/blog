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
content is hosted on decentralized relays independently of this browser client, and can be read through any other Nostr client which supports NIP-23 events.`,

    `When you visit this page, your browser connects to multiple independent relays, and requests all content
under my public key. In contrast to standard clients like Primal, it will only display content under my public key,
essentially making this page a personal blog where the content is not hosted by me but instead independent relays.`,
  ],

  // Why not self-host section
  whyNotSelfHost: {
    heading: "Why not just host everything myself?",
    paragraphs: [
      `I've always wanted to have a personal page where I could put my ideas, learnings, and thoughts into writing, and share them with friends and family, or just make them available to the world. Over the past 2 years, I've been interested in Nostr and its potential to be the identity protocol of the internet. But in order for Nostr to succeed, the applications and content on it should offer some amount of humanity, effort, or quality that is becoming harder to come by in the modern internet. So that's the primary reason of this Nostr integration in my blog: ensuring that the work I'll put a lot of energy and thought into also enriches the protocol which I support as a building block of the future internet.`,

      `In addition to that, there are other perks:`,
    ],
    bulletPoints: [
      `The writings live independently of this web page. If this web page is not accessible for some reason, the writings still will be through the many other Nostr clients since they live on Nostr relays.`,

      `All of the content on this website will have been signed by my private key. Anyone can look at the source code or check out my content through other Nostr clients to confirm that. This is in contrast with other hosted solutions like Substack and Bear Blog which, while great products, do not offer the same level of identity confirmation.`,

      `You can use any client which supports NIP-23 events to read the writings you can read here. The content which are under my public key is the same irrespective of what front-end you choose to fetch and read them with.`,
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
