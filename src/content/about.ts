/**
 * About Page Content
 *
 * Edit this file to update the content on the About page.
 * No coding knowledge required - just edit the text between the quotes.
 */

export const aboutContent = {
  // Page title and description (used for SEO only)
  title: "About",
  subtitle: "Who I am and what I do",

  // Main content sections
  sections: [
    {
      heading: "",
      content: `[Your introduction goes here. Tell visitors about yourself, your background,
and what drives you. This is your space to share your story.]`,
    },
    {
      heading: "What I Do",
      content: `[Describe your work, your interests, and your projects. What are you passionate about?
What kind of content do you create? What problems are you trying to solve?]`,
    },
    {
      heading: "My Journey",
      content: `[Share your journey so far. How did you get here? What experiences shaped you?
What are you working towards?]`,
    },
    {
      heading: "Connect",
      content: `[Add your contact information, social links, or ways people can reach you.
You can also mention what kind of conversations or collaborations you're open to.]`,
    },
  ],

  // Footer disclaimer
  footer: {
    paragraphs: [
      {
        text: "This is a Nostr client running on your browser which only displays the long-form (NIP-23) and short-form (NIP-01) content I've authored and published on Nostr. See {howItWorks} for an explanation of how this page is interacting using Nostr to fetch my writings, and why I chose to build it this way.",
        links: {
          howItWorks: "/how-it-works",
        },
      },
      {
        text: "I vibe-coded the page using {shakespeare}.",
        links: {
          shakespeare: "https://shakespeare.diy",
        },
      },
      {
        text: "The views and opinions are mine, and not of any past, present, or future employer, family, or friend.",
        links: {},
      },
    ],
  },
};
