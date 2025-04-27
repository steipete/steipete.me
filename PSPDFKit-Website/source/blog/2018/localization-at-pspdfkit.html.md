---
title: "Localization at PSPDFKit"
description: "An overview of how localization is handled at PSPDFKit."
preview_image: /images/blog/2018/localizations-at-pspdfkit/article-header.png
section: blog
author:
  - Christoph Mantler
author_url:
date: 2018-02-19 12:00 UTC
tags: Development, Android, iOS, Localization
published: true
---

The PSPDFKit SDK is localized in almost 30 languages. You can see [the full list of all languages here][Language List]. The system language setting of a device defines which language is used, defaulting to English if there are no translations for the preferred language.

Things move quickly at PSPDFKit, so nearly every week there are new strings that need to be translated for certain features and for several different projects.

Although we have developers from all around the globe and therefore can translate some languages on our own, there is no way we would be able to support so many languages without the help of a dedicated translation company. For our needs, we use [Wordcrafts][Wordcrafts Website].

## The Localization Process

For each string that needs to be translated, we create an issue on [GitHub][GitHub Website] that shows the string, describes where the issue is needed, links to where the string is needed in the code, and states in which release it will be needed. This information is very important for the translators at Wordcrafts, since they are not familiar with our code. As a result, they need as much information as possible to know in which context the string is used, as this can affect the meaning of the translations a lot.

Once everything is ready on our side, we create a separate branch and mail all the information we have to Wordcrafts. The translation process, including QA testing, takes about two to three days.

When Wordcrafts is finished with the translations, the company will push its changes in the dedicated branch, create a pull request on GitHub, and send us an email stating that everything is finished. Once this occurs, the translations go through a second process of QA — this time on our end — to ensure that all strings are correct. There are also tests in place to check whether or not the code syntax is correct. All of these checks and tests take place on both sides to ensure our customers receive what they pay for: an outstanding product.

Afterward, all the translated strings are copied into the correct project repository via a [rake][Rake Website] script and then pushed to GitHub. Once again, they are reviewed by a different pair of eyes, and if everything looks good, we will merge them to be included in the next release.

However, there are certain things to look out for when translating strings. One of these is understanding which string needs to be translated in which format.

## Strings and Stringsdict

[.strings][Strings Apple Dev] is the file format used to assign the key (usually the English string) one translation for each language, while the [.stringsdict][Stringsdict Apple Dev] file format is used to assign each key several translations, depending upon if the string is used singularly or plurally. That means the `.stringsdict` file format defines the language plural rules for each string.

### Strings Example

As you can see below, each key (on the left) has one string (on the right) assigned in every `.strings` file:

```md
"Close" = "Cerrar";
"Cancel" = "Cancelar";
"OK" = "Aceptar";
"Open" = "Abrir";
"Untitled" = "Sin título";
"File Not Found" = "Archivo no encontrado";
```

### Stringsdict Example

Below is a great example of how a plural string will look when translated. The key is defined on the top, and below are all the various cases that can apply for this string (zero, one, other):

```md
<key>%tu match(es) found</key>
<dict>
    <key>NSStringLocalizedFormatKey</key>
    <string>%#@tu_matches_found@</string>
    <key>tu_matches_found</key>
    <dict>
        <key>NSStringFormatSpecTypeKey</key>
        <string>NSStringPluralRuleType</string>
        <key>NSStringFormatValueTypeKey</key>
        <string>tu</string>
        <key>zero</key>
        <string>Ningún resultado</string>
        <key>one</key>
        <string>%tu resultado</string>
        <key>other</key>
        <string>%tu resultados</string>
    </dict>
</dict>
```

However, plural strings can vary a lot, and some languages even differentiate between plurals. To illustrate this, let’s look at a simple example of counting search results comparing English and Slovenian. In English, search results might be counted as `1 match found`, `2 matches found`, `3 matches found` — anything larger than one being plural. In Slovenian, however, we’d have `najden 1 zadetek`, `najdena 2 zadetka`, `najdeni 3 zadetki`, `najdeni 4 zadetki`, `najdenih 5 zadetkov`, `najdenih 6 zadetkov` — only after five or more do we get a _many_ kind of plural. Suffice to say, this results in a huge list of rules that can apply. For anyone interested in taking a look, [here’s where you can find it][Language Plural Rules].

## Conclusion

As you can see, a long and precise process is needed to ensure that all the words and sentences that appear on your screen are properly translated. But this is very important, because every customer deserves the same quality, independent of the language they use.


[Language List]: https://pspdfkit.com/guides/ios/current/features/localization/
[Wordcrafts Website]: https://www.wordcrafts.de/
[GitHub Website]: https://github.com/
[Rake Website]: https://github.com/ruby/rake
[Stringsdict Apple Dev]: https://developer.apple.com/library/content/documentation/MacOSX/Conceptual/BPInternational/StringsdictFileFormat/StringsdictFileFormat.html
[Strings Apple Dev]: https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html
[Language Plural Rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
