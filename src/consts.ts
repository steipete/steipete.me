// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface SocialLink {
  href: string;
  label: string;
}

interface Site {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  editPost: {
    enabled: boolean;
    text: string;
    url: string;
  };
  dynamicOgImage: boolean;
  lang: string;
  timezone: string;
}

// Site configuration
export const SITE: Site = {
  website: "https://jasontopia.me",
  author: "Jasontopia",
  profile: "https://jasontopia.me/about",
  desc: "I'm Jasontopia, an AI solopreneur building singular leverage with AI - sharing model shifts, tools, and monetization playbooks.",
  title: "Jasontopia",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: false,
  showBackButton: false,
  editPost: {
    enabled: true,
    text: "Edit on GitHub",
    url: "https://github.com/jasontopia/jasontopia.me/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "America/Edmonton",
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.desc;

// Navigation links
export const NAV_LINKS: SocialLink[] = [
  {
    href: "/",
    label: "Blog",
  },
  {
    href: "/about",
    label: "About",
  },
];

// Social media links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/jasontopia",
    label: "GitHub",
  },
  {
    href: "https://x.com/jasontopia",
    label: "X",
  },
  {
    href: "https://www.linkedin.com/in/jasontopia/",
    label: "LinkedIn",
  },
  {
    href: "/rss.xml",
    label: "RSS",
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  X: "twitter",
  LinkedIn: "linkedin",
  RSS: "rss",
  Email: "mail",
};
