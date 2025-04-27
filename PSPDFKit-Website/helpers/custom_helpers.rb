require_relative '../lib/commonmarker_renderer'

module CustomHelpers
  # Wrap access to the sitemap so it can be stubbed in tests
  def sitemap
    app.sitemap
  end

  # Convert markdown string to HTML
  def markdown(s)
    Tilt['markdown'].new { s.strip_heredoc }.render
  end

  # Smart punctuation via SmartyPants
  def punctuate(s)
    strip_tags(markdown(s))
  end

  # Return the correctly capitalized platform name from a lowercase string
  # TODO: Replace with custom inflection
  def platform_name(p)
    case p
    when 'ios'
      'iOS'
    when 'macos'
      'macOS'
    else
      p.titleize
    end
  end

  # Return the full product name for a given product slug
  def product_name(p)
    case p
    when 'ios'
      'PSPDFKit for iOS'
    when 'android'
      'PSPDFKit for Android'
    when 'web'
      'PSPDFKit for Web'
    when 'macos'
      'PSPDFKit for macOS'
    when 'windows'
      'PSPDFKit for Windows'
    when 'instant'
      'PSPDFKit Instant'
    when 'server'
      'PSPDFKit Server'
    when 'dotnet'
      'PSPDFKit .NET Library'
    when 'java'
      'PSPDFKit Java Library'
    end
  end

  # Return the short product name for a given product slug
  # TODO: Replace with custom inflection
  def product_short_name(p)
    case p
    when 'ios'
      'iOS'
    when 'macos'
      'macOS'
    when 'dotnet'
      '.NET'
    else
      p.humanize
    end
  end

  # Return the current product version for a given product slug
  def product_version(p)
    "v#{VERSIONS[p].last}"
  end

  # Return a constant value defined inside source/guide_constants.json
  def guide_constant(platform, key)
    # Use string interpolation since JSON can contain strings, numbers, etc.
    GUIDE_CONSTANTS[platform][key].to_s
  end

  def latest_version(platform, format = :patch)
    major, minor, patch = VERSIONS[platform.to_s].last.split('.')
    case format
    when :patch
      "#{major}.#{minor}.#{patch}"
    when :minor
      "#{major}.#{minor}"
    when :major
      "#{major}"
    when :min
      "#{major}.#{minor}.+"
    end
  end

  # Resolve the platform for a page using tags or metadata
  def page_platform(page)
    platform = page.data.platform

    if page.respond_to?(:tags)
      if %w[Android iOS Web macOS Windows Instant].include?(page.tags.first)
        platform = page.tags.first.downcase
      end
    elsif current_page.path.match(/guides/)
      platform ||= current_guide_platform
    end

    platform
  end

  # Get the platform for the current page
  def current_platform
    page_platform(current_page)
  end

  # Conditionals for including platform-specific content in shared guides
  # Example:
  # <% if ios? %>
  #   # content...
  # <% end %>
  PLATFORMS.each do |platform|
    define_method :"#{platform}?" do
      current_platform == platform
    end
  end

  # Return a slug for a given page based on its url
  def page_slug(page = current_page)
    page.url == '/' ? 'home' : page.url.split('/').drop(1).join('-')
  end

  def preview_image(page)
    path =
      if page.data.preview_image
        image_path(page.data.preview_image)
      else
        image_path('/images/preview-default.png')
      end
    "https://pspdfkit.com#{path}"
  end

  # Generate breadcrumb links
  def breadcrumbs(page, tag = nil, year = nil)
    list = [page]

    # Add additional segments where folder hierarchy doesn't match site structure
    if page.url.match(/acknowledgements/)
      list.unshift(sitemap.find_resource_by_path('legal/index.html'))
    end
    if page.url.match(%r{careers/[a-z]+})
      list.unshift(sitemap.find_resource_by_path('careers/index.html'))
    end
    if page.url.match(%r{changelog/[a-z]+})
      list.unshift(sitemap.find_resource_by_path('developers/index.html'))
    end

    # Custom breadcrumb for blog article pages
    if page.url.match(%r{blog/[0-9]{4}})
      original_index_page = sitemap.find_resource_by_path('blog/index.html')
      index_page =
        ::Middleman::Sitemap::Resource.new(sitemap, original_index_page.path)
      index_page.data.title = '← Blog Overview'
      list = [index_page]
    end

    # Custom breadcrumb for blog tag pages
    if tag
      tag_page =
        sitemap.find_resource_by_path(
          "blog/categories/#{tag.parameterize}.html"
        )
      tag_page.data[:title] = tag
    end

    # Custom breadcrumb for blog year pages
    if year
      year_page = sitemap.find_resource_by_path("blog/#{year}.html")
      archive_page = sitemap.find_resource_by_path('blog/categories.html')
      year_page.data[:title] = year.to_s
      list = []
      list.push(archive_page)
      list.push(year_page)
    end

    # Add segments according to folder hierarchy
    list.unshift(list.first.parent) while list.first.parent

    list.reject { |p| p.data.skip_breadcrumb }.map do |p|
      link_to(
        (p.data.title || '').split(/\s-|–|—\s/).first.try(:strip),
        "/#{p.path}",
        class: 'breadcrumb-item breadcrumb-item-brand'
      )
    end.join('')
  end

  # Highlight the currently active section in the nav-bar
  def active_section?(section)
    current_page.data.section == section
  end

  # Return the full meta page title for a given page
  def meta_title(page)
    prefix = @title || @tagname || page.data.title
    suffix = @title_suffix || page.data.title_suffix
    suffix = suffix == false ? nil : suffix || 'PSPDFKit'
    suffix = 'Inside PSPDFKit' if page.url.match('/blog')
    [prefix, suffix].compact.join(' | ')
  end

  # Return the meta description for a given page
  def meta_description(page)
    if @description
      @description
    elsif current_page.data.description || current_page.try(:summary)
      current_page.data.description || remove_tags(current_page.summary)
    else
      require 'middleman-blog/truncate_html'
      html = TruncateHTML.truncate_at_length(page.render(layout: false), 300)
      remove_tags(html).squish
    end
  end

  # Strip html tags from a string, but preserve whitespace (based on Padrino's `strip_tags`)
  def remove_tags(html)
    html.gsub(%r{<\/?[^>]*>}, ' ').strip if html
  end

  # Resolve an article's CTA using tags or metadata
  def article_cta(article)
    cta =
      article.data.cta ||
        if article.respond_to?(:tags)
          if %w[Android iOS Web macOS Windows Instant].include?(
             article.tags.first
           )
            article.tags.first.downcase
          end
        end
    "cta_#{cta || 'newsletter'}"
  end

  # Return path to article image
  def article_image(article)
    article.data.preview_image ||
      begin
        platform = page_platform(article)
        category =
          if article.tags.include?('Products')
            'products'
          elsif article.tags.include?('Customers')
            'products'
          elsif article.tags.include?('Development')
            'development'
          elsif article.tags.include?('Company')
            'company'
          end
        "/images/blog/preview-#{[category, platform].compact.join('-')}.svg"
      end
  end

  def article_public_tags(article)
    article.tags.reject { |t| t.start_with?('ga:') }
  end

  # Return a list of `featured` articles
  def featured_articles(count = 6)
    articles = blog('default').articles.reject { |a| a.data[:secret] }
    featured = articles.select { |a| a.data[:featured] }.take(count)
    featured +
      articles.reject { |a| a.data[:featured] }.take(count - featured.count)
  end

  # Return a list of articles by tag
  def tagged_articles(tag, count = 3, exclude = [])
    blog('default').tags.select { |t| t == tag }.map { |t, a| a }.first
      .reject { |a| a.data[:secret] || exclude.include?(a) }.take(
      count
    )
  end

  # Return a list of custom articles by url
  def custom_articles(urls = [])
    blog('default').articles.reject { |a| a.data[:secret] }.select do |a|
      urls.include?(a.url)
    end
  end

  # Return a list of articles grouped by year, optionally for a given tag
  def archived_articles(tag = nil)
    if tag
      blog('default').tags.select { |t| t == tag }.map { |t, a| a }.first
        .reject { |a| a.data[:secret] }.group_by { |a| a.date.year }
    else
      blog('default').articles.reject { |a| a.data[:secret] }.group_by do |a|
        a.date.year
      end
    end
  end

  # Return a list of related articles for a given article
  def related_articles(article, count = 3)
    related =
      blog('default').tags.select do |t|
        t == article.tags.first
      end.flat_map { |t, a| a }.reject { |a| a == article || a.data[:secret] }

    # On release articles we only show past release articles
    if article.tags.include?('Products')
      related =
        related.select do |a|
          a.path =~ %r{\/pspdfkit-} && a.date < article.date
        end
    end

    related.take(count)
  end

  # Return a list of all the years that the blog has articles for
  def blog_years
    blog('default').articles.map { |a| a.date.year }.uniq.sort.reverse
  end

  def guide_categories(
    platform = current_platform, version = current_guide_version
  )
    @guide_categories ||= {}
    @guide_categories["#{platform}_#{version}"] ||=
      begin
        YAML.load(
          File.read("source/guides/#{platform}/#{version}/categories.yml")
        )
      end
  end

  def guide_pages(
    platform = current_platform, version = current_guide_version, category
  )
    @guide_pages ||= {}
    @guide_pages["#{platform}_#{version}_#{category}"] ||=
      begin
        paths =
          Middleman::Util.all_files_under(
            "source/guides/#{platform}/#{version}/#{category}"
          )
            .map { |f| sitemap.file_to_path(f) }
        resources =
          paths.map { |p| sitemap.find_resource_by_path(p.sub('source/', '')) }
        resources.compact.select { |r| r.path.match('.html') }.reject do |r|
          r.data.secret ||
            r.is_a?(::Middleman::Sitemap::Extensions::RedirectResource)
        end.sort_by { |a| [(a.data.order || 1_000), a.data.title] }
      end
  end

  def guide_search_index(
    platform = current_platform, version = current_guide_version
  )
    guide_categories(platform, version).flat_map do |category|
      guide_pages(platform, version, category).map do |p|
        {
          id: p.url,
          title: p.data.title,
          body: File.read(p.source_file),
          secret: p.data.secret
        }
      end
    end.to_json
  end

  def current_guide_platform
    if current_page.path.match(/guides/)
      (GUIDES_PLATFORM || current_page.path.split('/')[1])
    end
  end

  def current_guide_version
    if current_page.path.match(/guides/)
      (GUIDES_VERSION || current_page.path.split('/')[2])
    end
  end

  def current_guide_category
    current_page.path.split('/')[3] if current_page.path.match(/guides/)
  end

  def guide_category_title(c)
    c.titleize
  end

  def previous_guide_link
    pages = guide_pages(current_guide_category)
    index = pages.index(current_page)
    if index && index > 0
      page = pages[index - 1]
      link_to "← #{page.data.title}", page.url
    end
  end

  def next_guide_link
    pages = guide_pages(current_guide_category)
    index = pages.index(current_page)
    if index && index < pages.length - 1
      page = pages[index + 1]
      link_to "#{page.data.title} →", page.url
    end
  end

  def available_platforms(resource = current_page)
    if resource.path.match(/guides/)
      category, page = resource.path.split('/').last(2)
      alternate_pages = resource.data.alternate_platform_links || {}
      sitemap.resources.select do |r|
        r.path.match(%r{^guides\/\w+\/current\/#{category}\/#{page}})
      end.map { |r| r.data.theme || r.path.split('/')[1] }.concat(
        # shared guides don't have a theme (platform), so get it from the path
        alternate_pages
          .keys
      )
        .uniq
    end
  end
end
