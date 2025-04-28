---
title: 'Using YouTube Embeds in Blog Posts'
pubDate: 2025-04-28T10:00:00.000Z
description: 'A quick guide on how to use the new YouTube embed functionality in blog posts'
tags:
  - Development
  - Guide
AIDescription: true
---

This post demonstrates how to use YouTube embeds in blog posts using the recommended syntax.

## Using the YouTube Embed Tag (Recommended Method)

To embed a YouTube video, use the following syntax:

```
{% youtube VIDEO_ID %}
```

Where `VIDEO_ID` is either the YouTube video ID or the full URL to the video.

### Examples

Using just the video ID:

{% youtube dQw4w9WgXcQ %}

Using the full YouTube URL:

{% youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ %}

Using a youtu.be short URL:

{% youtube https://youtu.be/dQw4w9WgXcQ %}

## Why Tag-Based Approach is Better

The tag-based approach has several advantages:
- Consistency with Twitter embeds syntax
- No component imports required
- Automatic processing by our content transformation pipeline
- No linting warnings from unused variables
- Better separation of content and presentation

## Twitter Embeds for Comparison

For reference, here's how Twitter embeds work:

{% twitter https://twitter.com/steipete/status/1134003594804547584 %}

## Component-Based Approach (Not Recommended)

There's also a direct component approach, but it's not recommended:

```astro
<YouTubeEmbed id="dQw4w9WgXcQ" title="Video Title" />
```

This approach creates linting warnings and is less consistent with our established patterns.

## Conclusion

Always use the `{% youtube %}` tag syntax for embedding YouTube videos in your blog posts. The embed is responsive and will adjust to different screen sizes, and you'll avoid the linting warnings associated with the component-based approach.