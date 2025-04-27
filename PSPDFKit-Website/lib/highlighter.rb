require 'rouge'

# Add support for some syntax aliases
module Rouge
  module Lexers
    class Curl < Rouge::Lexers::Shell
      tag 'curl'
    end

    class Batch < Rouge::Lexers::Shell
      tag 'bat'
    end

    class EJS < Rouge::Lexers::ERB
      tag 'ejs'
    end
  end
end

class Highlighter
  class << self
    def highlight(code, language, class_name: '', within_feed: false)
      # parse options from language tag in the format `lang[option=on|off]`

      if language.try(:match, /\]$/)
        /^(?<language>^.*)\[(?<options>.*)\]/ =~ language
        class_name += 'line-numbers-off' if options.match('lineno=off')
      end

      language, file_name = detect_language_and_filename(language)

      lexer = Rouge::Lexer.find_fancy(language_for_lexer(language), code)
      raise "Code block written in unknown language: #{language}" if lexer.nil?

      # XXX HACK: Redcarpet strips hard tabs out of code blocks,
      # so we assume you're not using leading spaces that aren't tabs,
      # and just replace them here.
      code.gsub! /^    /, "\t" if lexer.tag == 'make'

      formatter =
        Rouge::Formatters::HTMLTable.new(
          Rouge::Formatters::HTML.new,
          {
            table_class: 'code-table',
            gutter_class: 'code-gutter',
            code_class: 'code-content'
          }
        )
      table = formatter.format(lexer.lex(code))

      return table if within_feed # Do not decorate code sources in feed

      if file_name.present?
        table.sub!('<table class="code-table"><tbody><tr>', <<-HEADER)
  <table class="code-table"><tbody><tr>
  <thead>
    <tr>
      <td class="code-meta" colspan="2">#{
          file_name
        }</td>
    </tr>
  </thead>
  HEADER
      end

      # Add target for clipboard-controller.js
      table.sub!(
        '<td class="code-content">',
        '<td class="code-content" data-target="clipboard.code">'
      )

      name = language_to_name(language)

      result =
        "<div class=\"code-block lang-#{language} #{
          class_name
        }\" data-controller=\"clipboard\" data-target=\"code-switcher.block\">"
      result +=
        '<div class="nav nav-tabs nav-tabs-sm code-tabs justify-content-end" data-target="code-switcher.nav">'
      result +=
        "<span class=\"nav-item nav-item-#{
          language
        }\" ><a class=\"nav-link active\" href=\"#\" data-code-switcher-lang=\"#{
          language
        }\" data-action=\"click->code-switcher#change\">#{name}</a></span>"
      result += '</div>'
      if code.length > 140
        result +=
          '<span class="btn btn-outline-secondary btn-sm code-btn-copy"
                         data-action="click->clipboard#copy mouseenter->clipboard#hover">Copy</span>'
      end
      result += '<div class="code-scroller">'
      result += table
      result += '</div>'
      result += '</div>'
      result
    end

    def detect_language_and_filename(input)
      return [nil, nil] if input.nil?
      bare_language_regex = /\A\w+\z/

      if input =~ bare_language_regex
        [input, nil]
      else
        language = determine_language_from_filename(input)
        [language, input]
      end
    end

    def determine_language_from_filename(file_name)
      ext = /\.(\w+)$/.match(file_name)[1]
      case ext
      when 'hbs'
        'handlebars'
      when 'js'
        'javascript'
      when 'csharp'
        'c'
      when 'm', 'h'
        'objc'
      when 'kt', 'kts'
        'kotlin'
      when 'gradle'
        'groovy'
      when 'xaml', 'pom'
        'xml'
      when 'pro'
        'shell'
      else
        ext
      end
    end

    def language_for_lexer(language)
      case language
      when 'javascript', 'es'
        'jsx'
      when 'npm', 'yarn', 'nodejs', 'rails'
        'bash'
      when 'objcpp'
        'objective_c'
      when 'svelte'
        'html'
      when 'djinni'
        'cpp'
      when 'xaml'
        'xml'
      else
        language
      end
    end

    def language_to_name(language)
      case language
      when 'js', 'javascript'
        'JavaScript'
      when 'es'
        'ES6+'
      when 'jsx'
        'JSX'
      when 'csharp'
        'C#'
      when 'cpp'
        'C++'
      when 'objc'
        'Objective-C'
      when 'objcpp'
        'Objective-C++'
      when 'kt', 'kts', 'kotlin'
        'Kotlin'
      when 'gradle', 'groovy'
        'Groovy'
      when 'yml'
        'YAML'
      when 'sh', 'shell'
        'Shell'
      when 'bat'
        'Batch'
      when 'nodejs'
        'Node.js'
      when 'vb'
        'Visual Basic'
      when 'elm'
        'Elm'
      when 'swift', 'java', 'ruby', 'rails', 'svelte'
        language.titleize
      when 'html', 'css', 'scss', 'json', 'c', 'xml', 'xaml'
        language.upcase
      else
        language
      end
    end
  end
end
