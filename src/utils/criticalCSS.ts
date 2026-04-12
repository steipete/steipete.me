// Critical CSS for above-the-fold content
export const criticalCSS = `
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

  .bg-background {
    background-color: rgb(var(--background));
  }

  .text-foreground {
    color: rgb(var(--foreground));
  }

  .text-accent {
    color: rgb(var(--accent));
  }

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

  #theme-btn {
    width: 2rem;
    height: 2rem;
  }

  header {
    position: relative;
    z-index: 10;
  }

  #main-content {
    flex: 1;
    width: 100%;
  }

  html.scroll-smooth {
    scroll-behavior: smooth;
  }
`;

export function getPageCriticalCSS(pagePath: string): string {
  if (pagePath === "/" || pagePath === "") {
    return criticalCSS;
  }

  return criticalCSS;
}
