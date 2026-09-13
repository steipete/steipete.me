export const BLOG_PATH = "src/content/blog";

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

export const SITE: Site = {
  website: "https://steipete.me/",
  author: "Peter Steinberger",
  profile: "https://steipete.me/about",
  desc: "AI-powered tools from Swift roots to web frontiers. Every commit lands on GitHub for you to fork & remix.",
  title: "Peter Steinberger",
  ogImage: "peter-avatar.jpg",
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: false,
  showBackButton: false,
  editPost: {
    enabled: true,
    text: "Edit on GitHub",
    url: "https://github.com/steipete/steipete.me/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "America/Los_Angeles",
};
