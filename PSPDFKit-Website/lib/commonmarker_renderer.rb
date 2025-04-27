require 'commonmarker'

module Middleman
  module Renderers
    class CommonMarkerHtmlRenderer < CommonMarker::HtmlRenderer
      def initialize(scope)
        @scope = scope
        super()
      end

      def paragraph(node)
        if node.to_plaintext =~ /^\[==|==\]$/
          code_block_group(node)
        else
          super(node)
        end
      end

      def text(node)
        node.string_content =
          node.string_content.sub(/^(Changed|Added|Removed):/, '')
        super(node)
      end

      def list_item(node)
        text = node.to_plaintext
        regex = /^\s+-\s(change(d)?|add(ed|s)?|feature|new|fix(es|ed)?|deprecate(d|s)?|remove(d|s)?):\s/
        if text.downcase =~ regex
          tag = $1 || ''

          case
          when tag.match(/change/)
            badge = "<span class='badge badge-secondary'>Changed</span>"
          when tag.match(/add|feature|new/)
            badge = "<span class='badge badge-success'>Added</span>"
          when tag.match(/fix/)
            badge = "<span class='badge badge-info'>Fixed</span>"
          when tag.match(/deprecate|remove/)
            badge = "<span class='badge badge-danger'>Removed</span>"
          end
          out("<li class='media media-log'>")
          out("<div class='media-object'>#{badge}</div>")
          out("<div class='media-body'>", :children, '</div>')
          out('</li>')
        else
          super(node)
        end
      end

      # Wrap multiple code blocks to enable language switching behavior.
      def code_block_group(node)
        if node.to_plaintext =~ /^\[==/
          out('<div class="code-block-group" data-controller="code-switcher">')
        else
          out('</div>')
        end
      end

      # Syntax highlight code blocks.
      def code_block(node)
        if node.fence_info && !node.fence_info.empty?
          lang = node.fence_info.split(/\s+/)[0]
        end
        out(Highlighter.highlight(node.string_content, lang))
      end

      # Anchorify headings.
      def header(node)
        id = node.to_plaintext.parameterize
        level = node.header_level
        out(
          "<h#{level} class='anchorable'><span id='#{id}'></span>",
          :children,
          "</h#{level}>"
        )
      end

      # Lazy load images
      def image(node)
        # Make image urls absolute in RSS feed
        if @scope.instance_variable_get(:@opts)[:within_feed]
          node.url = @scope.app.config[:url_root] + @scope.image_path(node.url)
          super(node)
        else
          out(
            "<img src='/images/shared/placeholder.gif' data-src='#{
              node.url
            }' data-action='zoom' class='lazyload' loading='lazy' />"
          )
        end
      end

      # Add custom class to links.
      def link(node)
        out('<a href="', node.url.nil? ? '' : escape_href(node.url), '"')
        if node.title && !node.title.empty?
          out(' title="', escape_html(node.title), '"')
        end
        out(" class='link-brand'")
        out('>', :children, '</a>')
      end

      # Add `.table` class to tables.
      def table(node)
        @alignments = node.table_alignments
        @needs_close_tbody = false
        out("<table#{sourcepos(node)} class='table'>\n", :children)
        out('</tbody>') if @needs_close_tbody
        out("</table>\n")
      end
    end

    class CommonMarkerTemplate < ::Tilt::CommonMarkerTemplate
      def evaluate(scope, locals, &block)
        # Append shared markdown links to guides.
        data = self.data.dup

        if current_path = scope.try(:current_path)
          if current_path.match(/^guides/)
            if platform = scope.try(:current_platform)
              data +=
                "\n\n" +
                  File.read('source/guides/shared/_shared_markdown_links.md')
              platform_file =
                "source/guides/shared/_shared_markdown_links.#{platform}.md"
              if File.exist?(platform_file)
                data += "\n\n" + File.read(platform_file)
              end
            end
          end
        end

        # Use our custom renderer.
        doc = ::CommonMarker.render_doc(data, :SMART, %i[table autolink])
        renderer = CommonMarkerHtmlRenderer.new(scope)
        renderer.render(doc)
      end
    end

    class CommonMarkerChangelogRenderer < CommonMarkerHtmlRenderer
      # Anchorify headings.
      def header(node)
        level = node.header_level
        text = node.to_plaintext

        # Versioned anchoring only applies to `<h3>` and below
        if level <= 2
          out(
            "<h#{level} class='anchorable'><span id='#{
              text.parameterize
            }'></span>",
            :children,
            "</h#{level}>"
          )
          # Use just the version number for changelog version headings => #7.6.1
        elsif text =~ /^v?(\d+\.\d+(.\d+)?)/
          @last_version_number = $1
          out(
            "<h#{level} class='anchorable'><span id='#{
              @last_version_number
            }'></span>",
            :children,
            "</h#{level}>"
          )
          # Also include the version number for subheadings => #7.6.1-pspdfkit
        else
          out(
            "<h#{level} class='anchorable'><span id='#{@last_version_number}-#{
              text.parameterize
            }'></span>",
            :children,
            "</h#{level}>"
          )
        end
      end

      def list_item(node)
        text = node.to_plaintext
        badge = "<span class='badge badge-secondary'>Changed</span>"
        regex = /^\s+-\s(add(ed|s)?|feature|new|fix(es|ed)?|deprecate(d|s)?|remove(d|s)?|api\:)\s/

        if text.downcase =~ regex
          tag = $1 || ''

          case
          when tag.match(/api/)
            badge = "<span class='badge badge-warning'>API</span>"
            # content = content.sub('API: ', '')
          when tag.match(/add|feature|new/)
            badge = "<span class='badge badge-success'>Added</span>"
          when tag.match(/fix/)
            badge = "<span class='badge badge-info'>Fixed</span>"
          when tag.match(/deprecate|remove/)
            badge = "<span class='badge badge-danger'>Removed</span>"
          end
        end

        out("<li class='media media-log'>")
        out("<div class='media-object'>#{badge}</div>")
        out("<div class='media-body'>", :children, '</div>')
        out('</li>')
      end

      def text(node)
        node.string_content = node.string_content.sub('API:', '')
        super(node)
      end
    end

    class CommonMarkerChangelogTemplate < ::Tilt::CommonMarkerTemplate
      def evaluate(scope, locals, &block)
        # Use our custom renderer.
        doc = ::CommonMarker.render_doc(data, :SMART, %i[table autolink])
        renderer = CommonMarkerChangelogRenderer.new(scope)
        renderer.render(doc)
      end
    end

    ::Tilt.register CommonMarkerChangelogTemplate, 'changelog.md'
  end
end
