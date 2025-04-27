---
title: "Adding Spellchecking to Your Tests"
description: "How we added simple spelling and grammar checks to our website build process to catch some common mistakes."
preview_image: /images/blog/2018/adding-spellchecking-to-your-tests/article-header.png
section: blog
author:
  - William Meleyal
author_url:
  - http://meleyal.com
date: 2018-08-06 12:00 UTC
tags: Development, Testing
published: true
---

As your company and team grow, it’s important to define some conventions for your writing, just as you would with code, to ensure consistent quality standards. This post outlines how we added simple spelling and grammar checking to our website buildprocess to catch some common mistakes.

## Why Spellcheck?

With many authors, an international team, different editing environments, and copy and paste, it’s not uncommon for typos and grammar mistakes to creep in to our website, whether on marketing pages, in blog posts, or in documentation.

Just as style guides and linters enforce code formatting rules, having similar rules around other forms of writing can help ensure quality and define a more consistent tone across communications.

## How We Implemented It

As [discussed previously][previous middleman post], our website is built with the static site generator [Middleman][]. Pull requests are tested via [Jenkins][], which runs some [Rake][] tasks to ensure that the website builds without errors and that the automated system tests pass.

We added a couple of simple methods to our build task. They check all our Markdown files for common spelling mistakes and grammar errors — not that anyone ever misspells PSPDFKit, but just in case:

```ruby
task :build do
  # other build stuff...
  check_for_typos
end

def check_for_typos
  validate_string('PSPFSDFKit', 'PSPDFKit')
  # ...
end

def validate_string(invalid, valid)
  files =
    Dir.glob('**/*.md').reject do |f|
      f['node_modules'] || f['vendor'] || f['bundle']
    end
  begin
    invalid_files = []
    files.each do |file|
      invalid_files.push(file) if File.readlines(file).grep(/#{invalid}/).any?
    end
    raise if invalid_files.length > 0
  rescue StandardError
    puts "#{invalid} is invalid. It should be replaced with #{
           valid
         }, check the contents of:"
    puts invalid_files.join("\n")
    exit 1
  end
end
```

## Taking It Further

There’s obviously much more you could do with this beyond adding additional typos — from enforcing consistent title rules (e.g. AP Style Title Case), to codifying _[The Elements of Style][]_ in its entirety.

We haven’t yet had the need for this, but there are also many more [sophisticated][hunspell] [spellcheckers][aspell] out there with wrappers for your language of choice.

Moving the configuration into its own config file could also open the door for an automated review service similar to [Danger][], [Code Climate][], or [Hound][], or enable auto-formatting with tools like [Prettier][] and
[RuboCop][].

## Conclusion

The spellchecking task was implemented by our documentation team in response to recurring errors they were finding. However, we recently merged our website and documentation repositories into a monorepo, and while the website is always carefully reviewed, after the merge, the spellchecker brought up many mistakes that had gone unnoticed. Overall, this was such a simple change to implement, but it has been effective in improving the quality of our blog posts and documentation.

[previous middleman post]: /blog/2018/using-webpack-with-middleman/
[middleman]: https://middlemanapp.com/
[jenkins]: https://jenkins.io/
[rake]: https://github.com/ruby/rake
[hunspell]: http://hunspell.github.io/
[aspell]: http://aspell.net/
[danger]: https://github.com/danger/danger
[code climate]: https://codeclimate.com/
[hound]: https://houndci.com/
[prettier]: https://github.com/prettier/prettier
[rubocop]: https://github.com/rubocop-hq/rubocop
[the elements of style]: https://en.wikipedia.org/wiki/The_Elements_of_Style
