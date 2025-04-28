---
title: 'Using YouTube Embeds in Blog Posts'
pubDate: 2025-04-28T10:00:00.000Z
description: 'A quick guide on how to use the new YouTube embed functionality in blog posts'
tags:
  - Development
  - Guide
AIDescription: true
---

This post demonstrates how to use YouTube embeds in blog posts using the new syntax.

## Using the YouTube Embed Tag

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

## Twitter Embeds for Comparison

For reference, here's how Twitter embeds work:

{% twitter https://twitter.com/steipete/status/1134003594804547584 %}

## Conclusion

Now you can easily embed YouTube videos in your blog posts using the same pattern as Twitter embeds. The embed is responsive and will adjust to different screen sizes.