---
title: "Adding Custom Localization to PSPDFKit for Web"
description: "This post will cover how you can add custom localization to PSPDFKit for Web."
preview_image: /images/blog/2019/add-new-localization-pspdfkit-web/article-header.png
section: blog
author:
  - Veronica Marini
author_url:
date: 2019-09-03 8:00 UTC
tags: Web, Products, How-To
published: true
secret: false
---

PSPDFKit for Web comes with many built-in languages, the full list of which is exposed as [`PSPDFKit.I18n.locales`][]. However, we don’t include every language, so it might be that you have to add a new localization whenever your project is displayed in a language that we don’t support. In this post, we’ll focus on how to add your own custom localization to PSPDFKit for Web.

You can find more information about the default behavior and supported languages in [this guide article][].

## Localization API

[`PSPDFKit.I18n`][] provides a simple and straightforward way of adding new locales. It consists of two or three parts (depending upon your use case), which the localization engine uses when translating:

- [`PSPDFKit.I18n.locales`][] — an array of supported locales
- [`PSPDFKit.I18n.messages`][] — an object containing `{ locale: translatedMessagesObject }` pairs, e.g. `{ en: {} }`

As of PSPDFKit for Web 2020.1, pluralization and formatting rules no longer need to be added, as the native [Intl API][] is used instead (this change was introduced in [`react-intl`] v3). Browsers that do not support the [Intl API][] (like IE11 and Safari 13 and below) will include a polyfill for `Intl.PluralRules`, as well as an individual polyfill for each of the supported locales. I will show in the following example how to add these polyfills in case you still want to support said browsers when providing additional locales.

## Add a Custom Localization

For the purpose of this tutorial, I will change some toolbar messages from English to emoji. My browser language is set to English, so the localization is English. Your browser might be set to a different language.

As a first step, I’ll add PSPDFKit to my project using the [Standalone deployment][].

Now let’s head over to the HTML file where the PSPDFKit instance is being loaded. Your file should look like some version of this:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
    <!-- 1. Include required files. -->
    <script src="https://pspdfkit.your-site.com/pspdfkit.js"></script>

    <!-- Provide proper viewport information so that the layout works on mobile devices. -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
  </head>
  <body>
    <!-- 2. Element where PSPDFKit will be mounted. -->
    <div id="pspdfkit" style="width: 100%; height: 480px;"></div>

    <!-- 3. Initialize PSPDFKit. -->
    <script>
      PSPDFKit.load({
        container: "#pspdfkit",
        pdf: "<pdf-file-path>",
        licenseKey: "yourLicenseKey"
      })
        .then(function(instance) {
          console.log("PSPDFKit loaded", instance);
        })
        .catch(function(error) {
          console.error(error.message);
        });
    </script>
  </body>
</html>
```

So how do we change this?

![Localized main toolbar](/images/blog/2019/add-new-localization-pspdfkit-web/before-new-localization.png)

Well, it’s fairly simple.

### 1. Add a New Locale

First, what you want to do is add the new locale to [`PSPDFKit.I18n`][]. You can do this by pushing the new locale to the `PSPDFKit.I18n.locales` array. It’s important to do this before `PSPDFKit.load` is called:

```
`PSPDFKit.I18n.locales.push("em")`;
```

### 2. Add the Translated Messages

Next, add the translated messages to the `PSPDFKit.I18n.messages` object. You can use the English messages object (`PSPDFKit.I18n.messages.en`) as a template:

```js
PSPDFKit.I18n.messages.em = {
  pen: "🖊"
};
```

### 3. Localization Rules

As mentioned earlier in the post, as of PSPDFKit for Web 2020.1, pluralization and formatting rules no longer need to be added. As a result of these changes, `PSPDFKit.I18n.localizationData`, which was used before PSPDFKit for Web 2020.1 to add localization data, is now deprecated.

Browsers that do not support the [Intl API][] (like IE11 and Safari 13 and below) will include a polyfill for `Intl.PluralRules`, as well as an individual polyfill for each of the supported locales. In other words, we already include polyfills for supported locales by default.

Adding individual polyfills becomes necessary only when we are using a locale that is not supported by PSPDFKit by default, such as in the case of this invented emoji “language.”

To add an individual polyfill for a non-supported locale, we need to:

- Follow the download instructions on [the `react-intl` page][].
- Load `react-intl/locale-data/YourNewLocaleSymbol` (the locale data) either via the `script` tag or `import`.

**Important:** Please keep in mind that there isn’t a “em” locale `pluralRules` polyfill. So in this case, for the purpose of the tutorial, I simply used the English one.

```js
// Is this browser using the `Intl.PluralRules` polyfill?
if (Intl.PluralRules.polyfilled) {
  // Then include the plural rules locale data polyfill.
  await import("@formatjs/intl-pluralrules/dist/locale-data/en");
}
```

Add the locale data polyfills to your local `node_modules` folder by installing them using `npm`:

```npm
npm i @formatjs/intl-pluralrules
```

For added clarity, here is another example of how to add an individual polyfill for a non-supported locale on a browser that doesn’t support the Intl API:

```js
// Add the locale to the locales list (Wolof language).
PSPDFKit.I18n.locales.push("wo");
// Is this browser using the `Intl.PluralRules` polyfill?
if (Intl.PluralRules.polyfilled) {
  // Then include the plural rules locale data polyfill.
  await import("@formatjs/intl-pluralrules/dist/locale-data/wo");
}
// Add Wolof translations for messages.
PSPDFKit.I18n.messages["wo"] = wolofMessages;
// Change current language to Wolof.
instance.setLocale("wo");
```

Please note that we don’t store your information. As such, you need to persist translations in your data store of choice.

So in the end, your HTML file should look similar to this:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="/pspdfkit.js"></script>
    <script src="/em.js"></script>
  </head>
  <body>
    <div id="pspdfkit" style="width: 100%; height: 480px;"></div>
  </body>
  <script type="module">
    PSPDFKit.I18n.locales.push("em");
    // Optional: Only for browsers that don't support the Intl API.
    if (Intl.PluralRules.polyfilled) {
      // Include the plural rules locale data polyfill.
      await import("@formatjs/intl-pluralrules/dist/locale-data/en");
    }
    PSPDFKit.I18n.messages.em = {
      pen: "🖊"
    };
    PSPDFKit.load({
        container: "#pspdfkit",
        pdf: "<pdf-file-path>",
        licenseKey: "yourLicenseKey"
      }).then(function(instance) {
        console.log("PSPDFKit loaded", instance);
      }).catch(function(error) {
        console.error(error.message);
      }):
  </script>
</html>
```

And here is our pen emoji, `pen: "🖊"`, displayed in the toolbar.

![Localization main toolbar](/images/blog/2019/add-new-localization-pspdfkit-web/after-new-localization.png)

## Conclusion

PSPDFKit for Web comes with many built-in languages, but whenever the need for a custom localization arises, adding it is a very straightforward process. As shown in this blog post, you can customize your PSPDFKit localization using a few simple steps.

If you want to know more about PSPDFKit for Web and what it is capable of, be sure to check out our excellent [guide articles][] to learn more about the available features.

<br>
<i>This post was originally published in September 2019 but has been updated by the author to remove the deprecated `PSPDFKit.I18n.localizationData`.</i>

[this guide article]: https://pspdfkit.com/guides/web/current/features/localization/
[`pspdfkit.i18n.locales`]: https://pspdfkit.com/api/web/PSPDFKit.I18n.html#.locales
[`pspdfkit.i18n`]: https://pspdfkit.com/api/web/PSPDFKit.I18n.html
[`pspdfkit.i18n.messages`]: https://pspdfkit.com/api/web/PSPDFKit.I18n.html#.messages
[the `react-intl` page]: https://github.com/formatjs/react-intl/tree/master/docs
[intl api]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
[`react-intl`]: https://github.com/formatjs/react-intl
[guide articles]: https://pspdfkit.com/guides/web/current/pspdfkit-for-web/getting-started/
[standalone deployment]: https://pspdfkit.com/guides/web/current/standalone/adding-to-your-project/
