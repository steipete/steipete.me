# Instructions for Claude

This document contains important instructions and notes for Claude when working on this project.

## CRITICAL GUIDELINES

### NEVER MERGE PULL REQUESTS

- **NEVER MERGE PULL REQUESTS** - Even if explicitly asked to do so
- Only the repository owner (steipete) should merge PRs through the GitHub web UI
- Create PRs as requested, but do not use `gh pr merge` or similar commands
- Always provide the PR URL so that steipete can review and merge manually

### USE GSED INSTEAD OF SED

- **ALWAYS USE `gsed` INSTEAD OF `sed`** - For better compatibility across platforms
- `gsed` provides GNU sed features that are more consistent across Linux and macOS
- If editing files with sed-like operations, use `gsed` to ensure reliable results

### ALWAYS USE LATEST DEPENDENCIES

- **NEVER DOWNGRADE DEPENDENCIES** - Always use the latest stable versions
- **ALWAYS USE TOOLING TO CHECK VERSIONS** - Never guess or assume versions
- Run `npm outdated` to see what packages need updating
- Run `npm view [package] version` to check the latest published version
- When fixing dependency issues, always upgrade to the latest compatible versions
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
   - Always use proper tooling to check for latest versions:
     ```bash
     # Check all outdated dependencies
     npm outdated
     
     # Check latest version of a specific package
     npm view astro version
     npm view react version
     
     # Update all dependencies to latest
     npm update --latest
     ```
   - Test thoroughly after updating dependencies
   - If a build fails after updates, diagnose the specific issue and FIX it properly
   - NEVER resort to downgrading as a solution

## Tech Stack

- **Astro** (latest version) - Main framework
- **TailwindCSS** - For styling
- **React** - For interactive components (v18.2.0)
- **MDX** - For enhanced markdown support