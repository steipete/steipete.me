export const onRequest = async (context, next) => {
  const url = new URL(context.request.url);
  const hostname = context.request.headers.get('host');

  // Handle steipete.md domain - serve markdown versions
  if (hostname === 'steipete.md' || hostname === 'www.steipete.md') {
    // Don't add .md if it's already there
    if (!url.pathname.endsWith('.md')) {
      // Special handling for root path
      if (url.pathname === '/' || url.pathname === '') {
        // Rewrite to index.md
        return context.rewrite('/index.md');
      }
      
      // For all other paths, append .md
      const mdPath = url.pathname + '.md';
      
      // Create a new URL with the .md extension
      const newUrl = new URL(context.request.url);
      newUrl.pathname = mdPath;
      
      // Rewrite the request to the .md version
      return context.rewrite(newUrl.toString());
    }
  }

  // Redirect /blog/ paths to /posts/
  if (url.pathname.startsWith("/blog/")) {
    return context.redirect("/posts/" + url.pathname.slice(6), 301);
  }

  // Redirect /blog to /posts
  if (url.pathname === "/blog" || url.pathname === "/blog/") {
    return context.redirect("/posts/", 301);
  }

  return next();
};
