// Critical CSS for above-the-fold content
export const criticalCSS = `
  /* Base reset and font loading */
  *, ::before, ::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: currentColor;
  }
  
  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  body {
    margin: 0;
    line-height: inherit;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Critical layout containers */
  main {
    display: block;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
    margin: 0;
  }
  
  a {
    color: inherit;
    text-decoration: inherit;
  }
  
  img, svg {
    display: block;
    max-width: 100%;
    height: auto;
  }
  
  /* Dark mode critical styles */
  :root {
    --background: 253 253 253;
    --foreground: 17 24 35;
    --muted: 246 246 246;
    --accent: 0 108 172;
    --accent-dark: 255 107 1;
  }
  
  .dark {
    --background: 18 24 27;
    --foreground: 253 253 253;
    --muted: 30 41 49;
    --accent: 255 107 1;
  }
  
  /* Critical color classes */
  .bg-background {
    background-color: rgb(var(--background));
  }
  
  .text-foreground {
    color: rgb(var(--foreground));
  }
  
  .text-accent {
    color: rgb(var(--accent));
  }
  
  /* Layout utilities */
  .flex {
    display: flex;
  }
  
  .hidden {
    display: none;
  }
  
  .relative {
    position: relative;
  }
  
  .absolute {
    position: absolute;
  }
  
  .fixed {
    position: fixed;
  }
  
  /* Critical spacing */
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  
  .max-w-3xl {
    max-width: 48rem;
  }
  
  .p-4 {
    padding: 1rem;
  }
  
  /* Font loading optimization */
  @font-face {
    font-family: 'Atkinson';
    src: url('/fonts/atkinson-regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Atkinson';
    src: url('/fonts/atkinson-bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  
  body {
    font-family: 'Atkinson', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  /* Hide elements until JS loads */
  .no-js-hide {
    display: none;
  }
  
  /* Prevent layout shift */
  #theme-btn {
    width: 2rem;
    height: 2rem;
  }
  
  /* Header critical styles */
  header {
    position: relative;
    z-index: 10;
  }
  
  /* Main content area */
  #main-content {
    flex: 1;
    width: 100%;
  }
  
  /* Smooth scrolling when enabled */
  html.scroll-smooth {
    scroll-behavior: smooth;
  }
`;

// Get only the critical CSS needed for the specific page
export function getPageCriticalCSS(pagePath: string): string {
  // You can customize critical CSS per page type
  if (pagePath === "/" || pagePath === "") {
    // Homepage specific critical CSS
    return (
      criticalCSS +
      `
      /* Hero section */
      #hero img {
        width: 10rem;
        height: 10rem;
        border-radius: 9999px;
        object-fit: cover;
      }
    `
    );
  }

  if (pagePath.startsWith("/posts/")) {
    // Blog post specific critical CSS
    return (
      criticalCSS +
      `
      /* Article typography */
      .prose {
        color: rgb(var(--foreground));
        max-width: 65ch;
      }
      
      .prose h1 {
        font-size: 1.875rem;
        font-weight: 700;
        line-height: 2.25rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
      }
      
      /* Code blocks */
      .prose pre {
        overflow-x: auto;
        border-radius: 0.375rem;
        padding: 1rem;
        font-size: 0.875rem;
        line-height: 1.7142857;
      }
    `
    );
  }

  return criticalCSS;
}
