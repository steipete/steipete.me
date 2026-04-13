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
  website: "https://example.com/",
  author: "Nikita Borisov",
  profile: "https://www.linkedin.com/in/nikita-borisov-34b1b9381/",
  desc: "SRE/DevOps engineer focused on cloud infrastructure, reliability, automation, and practical AI adoption.",
  title: "Nikita Borisov",
  ogImage: "avatar.jpg",
  lightAndDarkMode: true,
  postPerIndex: 0,
  postPerPage: 0,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: false,
  showBackButton: false,
  editPost: {
    enabled: false,
    text: "Edit on GitHub",
    url: "",
  },
  dynamicOgImage: false,
  lang: "en",
  timezone: "Europe/Moscow",
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.desc;

// Navigation links
export const NAV_LINKS: SocialLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About",
  },
];

// Social media links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/yemmi17",
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/nikita-borisov-34b1b9381/",
    label: "LinkedIn",
  },
  {
    href: "mailto:nikitabrworkjob@gmail.com",
    label: "Email",
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  LinkedIn: "linkedin",
  Email: "mail",
};
