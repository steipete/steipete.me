# Instructions for Claude

This document contains important instructions and notes for Claude when working on this project.

## CRITICAL GUIDELINES

### ALWAYS USE LATEST DEPENDENCIES

- **NEVER DOWNGRADE DEPENDENCIES** - Always use the latest stable versions
- When fixing dependency issues, always upgrade to the latest compatible versions
- Check npmjs.com for the most recent versions before updating package.json
- Prioritize staying current with the ecosystem, even if it requires more work to adapt

### IMPORTANT: Development Server Limitation

- **DO NOT run `npm run dev`** in agent mode - this will create an endless loop and stop the agent from working properly
- Instead, use `npm run build` to verify your changes

## Development Process

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
   - Format dates in ISO-8601 format: `YYYY-MM-DDTHH:MM:SS+HH:MM`
   - Format tags as arrays: `tags: ["tag1", "tag2"]`

2. **Modifying site configuration**:
   - Edit `/src/consts.ts` for global site constants

3. **Styling changes**:
   - Edit files in `/src/styles/` for global styling
   - Use Tailwind classes in component templates for component-specific styling

4. **Layout changes**:
   - Modify the appropriate layout files in `/src/layouts/`

5. **Dependency Updates**:
   - Use `npm outdated` to check for outdated packages
   - Update dependencies to their latest versions
   - Test thoroughly after updating dependencies

## Tech Stack

- **Astro** (latest version) - Main framework
- **TailwindCSS** - For styling
- **React** - For interactive components (v18.2.0)
- **MDX** - For enhanced markdown support