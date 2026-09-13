import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInContext } from "node:vm";
import test from "node:test";
import { JSDOM } from "jsdom";
import { installPageLifecycle } from "../src/scripts/page.ts";
import { initializePost } from "../src/scripts/post.ts";
import { initializeSearch } from "../src/scripts/search.ts";

const markup = `
<button id="menu-btn" aria-expanded="false"></button><ul id="menu-items" class="hidden"></ul><span id="menu-icon"></span><span id="close-icon" class="hidden"></span>
<div id="reading-progress"></div><article id="article"><h2 id="intro">Intro</h2><pre><code>const answer = 42;\n</code></pre><input id="field"><div contenteditable="true"><span id="editor">Editable</span></div></article>
<a id="prev-post-link" href="/previous">Previous</a><a id="next-post-link" href="/next">Next</a><button id="back-to-top"></button>`;
const createDOM = (html = markup, url = "https://example.test/posts/current") =>
  new JSDOM(html, { url, pretendToBeVisual: true, runScripts: "outside-only" });
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const key = (window, target, value, options = {}) =>
  target.dispatchEvent(
    new window.KeyboardEvent("keydown", {
      key: value,
      bubbles: true,
      cancelable: true,
      ...options,
    }),
  );

test("page visits dispose old handlers and keep one set of article controls", (t) => {
  const dom = createDOM();
  t.after(() => dom.window.close());
  const { window } = dom;
  const document = window.document;
  const previous = installPageLifecycle(document);
  const dispose = installPageLifecycle(document);
  previous();
  t.after(dispose);
  assert.equal(document.querySelectorAll(".copy-code").length, 1);
  let clicks = 0;
  const destinations = [];
  const watchLinks = () =>
    document.querySelectorAll("a[id$='post-link']").forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        clicks++;
        destinations.push(link.getAttribute("href"));
      }),
    );
  document.dispatchEvent(new window.Event("astro:page-load"));
  watchLinks();
  key(window, document.body, "j");
  assert.equal(clicks, 1);
  document.dispatchEvent(new window.Event("astro:page-load"));
  assert.equal(document.querySelectorAll(".copy-code").length, 1);
  assert.equal(document.querySelectorAll(".heading-link").length, 1);
  key(window, document.body, "ArrowRight");
  assert.equal(clicks, 2);
  document.dispatchEvent(new window.Event("astro:before-swap"));
  key(window, document.body, "j");
  assert.equal(clicks, 2);
  document.body.innerHTML = markup.replace('/next"', '/new-next"');
  document.dispatchEvent(new window.Event("astro:page-load"));
  watchLinks();
  key(window, document.body, "j");
  assert.equal(destinations.at(-1), "/new-next");
  key(window, document.body, "k");
  assert.equal(clicks, 4);
  key(window, document.querySelector("#field"), "j");
  key(window, document.querySelector("#editor"), "k");
  key(window, document.querySelector("pre"), "ArrowRight");
  key(window, document.body, "j", { ctrlKey: true });
  assert.equal(clicks, 4);
  const menu = document.querySelector("#menu-btn");
  menu.click();
  assert.equal(menu.getAttribute("aria-expanded"), "true");
  key(window, document.body, "Escape");
  assert.equal(menu.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, menu);
});

test("copying uses code text, recovers from failures, and ignores late completion after disposal", async (t) => {
  const dom = createDOM();
  t.after(() => dom.window.close());
  const { window } = dom;
  const document = window.document;
  const scope = new window.AbortController();
  t.after(() => scope.abort());
  const copied = [];
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (text) => {
        copied.push(text);
      },
    },
  });
  initializePost(document, scope.signal);
  const button = document.querySelector(".copy-code");
  button.click();
  await tick();
  assert.deepEqual(copied, ["const answer = 42;\n"]);
  assert.equal(button.textContent, "Copied");
  window.navigator.clipboard.writeText = async () => {
    throw new Error("Denied");
  };
  button.click();
  await tick();
  assert.equal(button.textContent, "Copy failed");
  assert.equal(button.disabled, false);
  let resolve;
  window.navigator.clipboard.writeText = () =>
    new Promise((done) => {
      resolve = done;
    });
  button.click();
  scope.abort();
  const label = button.textContent;
  resolve();
  await tick();
  assert.equal(button.textContent, label);
});

test("reading progress is finite on short pages and clamps overscroll", (t) => {
  const dom = createDOM();
  t.after(() => dom.window.close());
  const document = dom.window.document;
  const scope = new dom.window.AbortController();
  t.after(() => scope.abort());
  Object.defineProperties(document.documentElement, {
    scrollHeight: { value: 500, configurable: true },
    clientHeight: { value: 500, configurable: true },
  });
  initializePost(document, scope.signal);
  const bar = document.querySelector("#reading-progress");
  assert.equal(bar.style.width, "0%");
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 1000 });
  document.documentElement.scrollTop = 250;
  dom.window.dispatchEvent(new dom.window.Event("resize"));
  assert.equal(bar.style.width, "50%");
  document.documentElement.scrollTop = 750;
  document.dispatchEvent(new dom.window.Event("scroll"));
  assert.equal(bar.style.width, "100%");
});

function searchFactory(root, record) {
  return class Search {
    constructor() {
      record.created++;
      root.innerHTML =
        '<input class="pagefind-ui__search-input"><button type="button" class="pagefind-ui__search-clear"><span>Clear</span></button>';
    }
    triggerSearch(term) {
      root.querySelector("input").value = term;
      record.terms.push(term);
    }
    destroy() {
      record.destroyed++;
      root.replaceChildren();
    }
  };
}

test("search restores the URL query, clears it without losing other parameters, and disposes UI", async (t) => {
  const dom = createDOM(
    '<div id="pagefind-search"></div>',
    "https://example.test/search?q=swift&source=test",
  );
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("#pagefind-search");
  const record = { created: 0, destroyed: 0, terms: [] };
  const scope = new dom.window.AbortController();
  t.after(() => scope.abort());
  await initializeSearch(root, scope.signal, async () => searchFactory(root, record));
  assert.deepEqual(record.terms, ["swift"]);
  assert.equal(dom.window.sessionStorage.getItem("backUrl"), "/search?q=swift&source=test");
  const input = root.querySelector("input");
  input.value = "actor";
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(new URL(dom.window.location.href).searchParams.get("q"), "actor");
  root.querySelector("button span").click();
  assert.equal(new URL(dom.window.location.href).searchParams.has("q"), false);
  assert.equal(new URL(dom.window.location.href).searchParams.get("source"), "test");
  scope.abort();
  assert.equal(record.destroyed, 1);
  input.value = "late";
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(new URL(dom.window.location.href).searchParams.has("q"), false);
});

test("an abandoned search import never mounts on the next page", async (t) => {
  const dom = createDOM('<div id="pagefind-search"></div>', "https://example.test/search");
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("#pagefind-search");
  const record = { created: 0, destroyed: 0, terms: [] };
  const scope = new dom.window.AbortController();
  let resolve;
  const pending = initializeSearch(
    root,
    scope.signal,
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  scope.abort();
  resolve(searchFactory(root, record));
  await pending;
  assert.equal(record.created, 0);
});

const themeScript = readFileSync("public/toggle-theme.js", "utf8");
function themeDOM() {
  const dom = createDOM('<button id="theme-btn"></button>', "https://example.test/");
  const media = new dom.window.EventTarget();
  media.matches = false;
  let subscriptions = 0;
  const add = media.addEventListener.bind(media);
  media.addEventListener = (...args) => {
    subscriptions++;
    return add(...args);
  };
  dom.window.matchMedia = () => media;
  dom.window.Date.now = () => Date.parse("2026-09-13T00:00:00Z");
  return { dom, media, subscriptions: () => subscriptions };
}

test("the early theme script is repeatable, preserves load handlers, and follows manual/system choices", (t) => {
  const { dom, media, subscriptions } = themeDOM();
  t.after(() => dom.window.close());
  const { window } = dom;
  const existingLoad = () => {};
  window.onload = existingLoad;
  runInContext(themeScript, dom.getInternalVMContext());
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
  runInContext(themeScript, dom.getInternalVMContext());
  assert.equal(window.onload, existingLoad);
  assert.equal(subscriptions(), 1);
  assert.equal(window.document.documentElement.dataset.theme, "light");
  window.document.querySelector("button").click();
  assert.equal(window.document.documentElement.dataset.theme, "dark");
  media.matches = false;
  media.dispatchEvent(new window.Event("change"));
  assert.equal(window.document.documentElement.dataset.theme, "dark");
  window.localStorage.clear();
  window.dispatchEvent(new window.StorageEvent("storage", { key: null }));
  assert.equal(window.document.documentElement.dataset.theme, "light");
  window.document.body.innerHTML = '<button id="theme-btn"></button>';
  window.document.dispatchEvent(new window.Event("astro:after-swap"));
  window.document.querySelector("button").click();
  assert.equal(window.document.documentElement.dataset.theme, "dark");
});

test("expired preferences and unavailable storage do not break theme selection", (t) => {
  const { dom } = themeDOM();
  t.after(() => dom.window.close());
  dom.window.localStorage.setItem("theme", "dark");
  dom.window.localStorage.setItem("themeSetTimestamp", String(Date.parse("2026-09-11T00:00:00Z")));
  runInContext(themeScript, dom.getInternalVMContext());
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  assert.equal(dom.window.document.documentElement.dataset.theme, "light");
  Object.defineProperty(dom.window, "localStorage", {
    get() {
      throw new Error("Storage blocked");
    },
  });
  dom.window.document.querySelector("button").click();
  assert.equal(dom.window.document.documentElement.dataset.theme, "dark");
});

test("search cannot rewrite a new route during a navigation in progress", async (t) => {
  const dom = createDOM('<div id="pagefind-search"></div>', "https://example.test/search");
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("#pagefind-search");
  const scope = new dom.window.AbortController();
  t.after(() => scope.abort());
  const record = { created: 0, destroyed: 0, terms: [] };
  await initializeSearch(root, scope.signal, async () => searchFactory(root, record));
  dom.reconfigure({ url: "https://example.test/posts/next" });
  const input = root.querySelector("input");
  input.value = "stale";
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(dom.window.location.href, "https://example.test/posts/next");
});
