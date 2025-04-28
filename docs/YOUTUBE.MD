# Using YouTube Embeds in Blog Posts

This document provides a quick guide on how to use YouTube embeds in blog posts.

## Using the YouTube Embed Tag (Recommended Method)

To embed a YouTube video, use the following syntax:

```
{% youtube VIDEO_ID %}
```

Where `VIDEO_ID` is either the YouTube video ID or the full URL to the video. 

### Examples

Using just the video ID:

```
{% youtube dQw4w9WgXcQ %}
```

Using the full YouTube URL:

```
{% youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ %}
```

Using a youtu.be short URL:

```
{% youtube https://youtu.be/dQw4w9WgXcQ %}
```

## How It Works

The site uses the `MDXTwitterTransform.astro` component to scan for these patterns in blog post content and replace them with proper YouTube embeds. The component detects special tags using regex and inserts responsive iframes.

## Component-Based Approach (Not Recommended)

There's also a direct component approach, but the tag-based method above is preferred:

```astro
<YouTubeEmbed id="dQw4w9WgXcQ" title="Video Title" />
```

This approach has several drawbacks:
- It requires importing the component
- It's less consistent with our Twitter embed syntax
- It's not automatically processed by our content transformation pipeline

**Note:** When using the component-based approach, the MDX compiler will issue warnings about unused variables. The tag-based method avoids these issues.

## Twitter Embeds for Comparison

Twitter embeds work in a similar way:

```
{% twitter https://twitter.com/steipete/status/1134003594804547584 %}
```

## Best Practices

1. Always use the `{% youtube %}` syntax instead of direct iframe embeds or the component
2. This ensures content won't be blocked by privacy-focused browsers
3. The embed is responsive and will adjust to different screen sizes
4. Works with all YouTube URL formats (full youtube.com URLs, youtu.be short URLs, or just the video ID)
5. Keeps consistency with our Twitter embed syntax
6. Avoids linting warnings