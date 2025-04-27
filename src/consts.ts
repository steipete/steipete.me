// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface SocialLink {
  href: string;
  label: string;
}

interface Site {
  title: string;
  description: string;
  href: string;
  author: string;
  locale: string;
  postsPerPage: number;
}

// Site configuration
export const SITE: Site = {
  title: 'Peter Steinberger',
  description: 'iOS developer, entrepreneur, founder of PSPDFKit (acquired), vibe coding my next project',
  href: 'https://steipete.com',
  author: 'Peter Steinberger',
  locale: 'en-US',
  postsPerPage: 10,
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.description;

// Navigation links
export const NAV_LINKS: SocialLink[] = [
  {
    href: '/posts',
    label: 'Posts',
  },
  {
    href: '/about',
    label: 'About',
  },
];

// Social media links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/steipete',
    label: 'GitHub',
  },
  {
    href: 'https://twitter.com/steipete',
    label: 'Twitter',
  },
  {
    href: 'https://bsky.app/profile/steipete.com',
    label: 'BlueSky',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  GitHub: 'github',
  Twitter: 'twitter',
  BlueSky: 'bsky',
  RSS: 'rss',
  Email: 'mail',
};