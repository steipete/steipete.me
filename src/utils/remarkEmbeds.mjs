import { visit } from "unist-util-visit";

function youtubeId(input) {
  if (/^[\w-]{11}$/.test(input)) return input;
  let url;
  try {
    url = new URL(input);
  } catch {
    return;
  }
  if (url.protocol !== "https:") return;
  let id;
  if (["youtu.be", "www.youtu.be"].includes(url.hostname)) {
    id = url.pathname.split("/")[1];
  } else if (
    url.hostname === "youtube.com" ||
    url.hostname.endsWith(".youtube.com") ||
    url.hostname === "www.youtube-nocookie.com"
  ) {
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : /^\/(embed|shorts)\//.test(url.pathname)
          ? url.pathname.split("/")[2]
          : undefined;
  }
  return id && /^[\w-]{11}$/.test(id) ? id : undefined;
}

function tweetId(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    return;
  }
  if (
    url.protocol !== "https:" ||
    !["twitter.com", "www.twitter.com", "mobile.twitter.com", "x.com", "www.x.com"].includes(
      url.hostname,
    )
  )
    return;
  return url.pathname.match(/\/status\/(\d+)(?:\/|$)/)?.[1];
}

const legacyTweet = (html) => html.match(/^\s*<TwitterEmbed\s+id=["'](\d+)["']\s*\/>\s*$/i)?.[1];
const tweetHtml = (id) =>
  `<blockquote class="twitter-tweet"><a href="https://twitter.com/i/web/status/${id}">View post on X</a></blockquote>`;

function embedHtml(kind, input) {
  if (kind === "twitter") {
    const id = tweetId(input);
    return id && tweetHtml(id);
  }
  const id = youtubeId(input);
  return (
    id &&
    `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
  );
}

function visibleText(node) {
  if (node.type === "text") return node.value;
  if (node.type === "link" && node.children.every((child) => child.type === "text")) {
    const label = node.children.map((child) => child.value).join("");
    if (label === node.url) return label;
  }
  if (node.type === "html") {
    const id = legacyTweet(node.value);
    if (id) return `{% twitter https://twitter.com/i/web/status/${id} %}`;
  }
  // Non-text nodes must retain their formatting and must not form part of a shortcode.
  return "\ufffc";
}

export function remarkEmbeds() {
  return (tree) => {
    visit(tree, "paragraph", (paragraph, index, parent) => {
      let text = "";
      const spans = paragraph.children.map((node) => {
        const start = text.length;
        text += visibleText(node);
        return { node, start, end: text.length };
      });
      const blocks = [];
      let inline = [];
      let cursor = 0;
      const append = (from, to) => {
        for (const span of spans) {
          const start = Math.max(from, span.start);
          const end = Math.min(to, span.end);
          if (start >= end) continue;
          inline.push(
            span.node.type === "text"
              ? { ...span.node, value: span.node.value.slice(start - span.start, end - span.start) }
              : span.node,
          );
        }
      };
      const flush = () => {
        if (inline.some((node) => node.type !== "text" || node.value.trim())) {
          blocks.push({ type: "paragraph", children: inline });
        }
        inline = [];
      };
      for (const match of text.matchAll(/\{%\s*(youtube|twitter)\s+(\S+?)\s*%\}/g)) {
        const html = embedHtml(match[1], match[2]);
        if (!html) continue;
        append(cursor, match.index);
        flush();
        blocks.push({ type: "html", value: html });
        cursor = match.index + match[0].length;
      }
      if (!blocks.length) return;
      append(cursor, text.length);
      flush();
      parent.children.splice(index, 1, ...blocks);
      return index + blocks.length;
    });
    visit(tree, "html", (node) => {
      const id = legacyTweet(node.value);
      if (id) node.value = tweetHtml(id);
    });
  };
}
