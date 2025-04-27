# Ruby language extensions
require 'active_support'
require 'active_support/core_ext'

# Custom extensions
Dir['./lib/*'].each { |f| require f }

# Load constants from a separate file to enable reuse in tests
require 'constants'

unless ENV['PSPDFKIT_ENV'] == 'test' || ENV['PSPDFKIT_ENV'] == 'console'
  # Use webpack as the asset pipeline
  activate :external_pipeline,
           name: :webpack,
           command: build? ? 'yarn build' : 'yarn start',
           source: '.tmp/dist',
           latency: 1
end

config[:js_dir] = 'assets/javascripts'
config[:css_dir] = 'assets/stylesheets'

# Blog
activate :blog do |blog|
  blog.name = 'default'
  blog.layout = 'blog/show'
  blog.prefix = 'blog'
  blog.permalink = ':year/:title'
  blog.sources = ':year/:title.html'
  blog.taglink = 'categories/{tag}.html'
  blog.tag_template = 'blog/tag.html'
  blog.year_template = 'blog/year.html'
end
ignore '/blog/show.html'

# Careers
activate :blog do |blog|
  blog.name = 'careers'
  blog.prefix = 'careers'
  blog.layout = 'careers/show'
  blog.permalink = ':title'
  blog.sources = 'posts/:title.html'
end
ignore '/careers/show.html'

# Guides
page '/guides/*', layout: 'guides'
ignore '/guides/shared/*'

# Acknowledgements & Changelogs
%w[ios android web windows macos server dotnet java].each do |p|
  proxy "/acknowledgements/#{p}.html",
        '/acknowledgements/template.html',
        locals: { platform: p }, ignore: true
  proxy "/changelog/#{p}.html",
        '/changelog/template.html',
        locals: { platform: p }, ignore: true
end

# Create a sitemap.xml for better search engine indexing
config[:url_root] = 'https://pspdfkit.com'
activate :search_engine_sitemap,
         exclude_if: lambda { |resource|
           resource.data.secret ||
             resource.url.match(%r{guides\/\w+\/\d+\.\d}) ||
             resource.is_a?(
               ::Middleman::Sitemap::Extensions::RedirectResource
             )
         }

# Enable REDIRECTS in development
activate :redirects

# Redirect bare guide category urls to their first article
activate :category_redirects

# Pretty urls without .html extension (/blog/index.html > /blog)
activate :directory_indexes

# Ignore raw files in the build process; they are included as partials.
ignore '*_raw.*'

# Domain verification files
page 'googleafddd9b12652db65.html', directory_index: false, hide_from_sitemap: true # Google
page 'n4vt2lq4u7g1s2o5wscky34ybcjnj7.html', directory_index: false, hide_from_sitemap: true # Facebook

# Set correct MIME type for videos
::Rack::Mime::MIME_TYPES['.mp4'] = 'video/mp4'

# Markdown config
config[:markdown_engine] = :common_marker
config[:markdown_engine_prefix] = Middleman::Renderers

configure :development, :test do
  # Reload the browser automatically whenever files change
  # activate :livereload

  # Use pry for middleman console
  activate :pry
end

configure :build do
  # Ensure that js is rendered even when doing a partial build
  activate :prerender_js

  # Enable overriding the asset host for archiving guides
  activate :asset_host, host: ASSET_HOST if ASSET_HOST.present?

  # Unique asset file names for cacheability
  activate :asset_hash do |asset_hash|
    # Add files that should be hashed (in addition to the defaults)
    asset_hash.exts =
      app.config[:asset_extensions] + %w[.mp4 .json]

    # Ignore files that should not be hashed
    asset_hash.ignore = [
      /\.ico/,
      /versions\.json/,
      /jsonsample/,
      /webassembly-benchmark/,
      /pwa/,
      /fonts\.css/
    ]
  end
end
