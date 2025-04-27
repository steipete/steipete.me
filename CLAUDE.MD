# Instructions for Claude

This document contains important instructions and notes for Claude when working on this project.

## Development Process

### IMPORTANT: Development Server Limitation

- **DO NOT run `npm run dev`** in agent mode - this will create an endless loop and stop the agent from working properly
- Instead, use `npm run build` to verify your changes

### Testing Changes

To properly test changes, use these commands:

```bash
# Build the project (this is preferred over npm run dev in agent mode)
npm run build

# If you need to preview the build (only do when specifically requested)
npm run preview
```

### Project Structure

- `/src/content/blog/` - Contains all blog posts in markdown format
- `/src/pages/` - Contains page templates and routing
- `/src/components/` - Reusable UI components
- `/src/layouts/` - Page layouts and templates
- `/src/styles/` - CSS styles including Tailwind customizations

### Common Tasks

1. **Adding a new blog post**:
   - Create a new markdown file in `/src/content/blog/`
   - Include proper frontmatter (title, description, pubDate, etc.)

2. **Modifying site configuration**:
   - Edit `/src/consts.ts` for global site constants

3. **Styling changes**:
   - Edit files in `/src/styles/` for global styling
   - Use Tailwind classes in component templates for component-specific styling

4. **Layout changes**:
   - Modify the appropriate layout files in `/src/layouts/`

## Tech Stack

- **Astro** v5.7.5 - Main framework
- **TailwindCSS** - For styling
- **React** - For interactive components
- **MDX** - For enhanced markdown support