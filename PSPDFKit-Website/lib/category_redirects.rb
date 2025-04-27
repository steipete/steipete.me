# Redirect bare guide category urls to their first article
# e.g. `/guides/ios/current/getting-started` => `/guides/ios/current/getting-started/integrating-pspdfkit`

class CategoryRedirects < ::Middleman::Extension
  def manipulate_resource_list(resources)
    redirects = []
    PLATFORMS.each do |p|
      categories =
        YAML.load(File.read("source/guides/#{p}/current/categories.yml"))
      categories.each do |c|
        paths =
          Middleman::Util.all_files_under(
            "source/guides/#{p}/current/#{c}"
          )
            .map { |f| @app.sitemap.file_to_path(f) }
        pages =
          paths.map do |p|
            @app.sitemap.find_resource_by_path(p.sub('source/', ''))
          end.compact
        if page =
           pages.reject { |r| r.data.secret }.sort_by do |r|
             [(r.data.order || 1_000), r.data.title || '']
           end.first
          redirects.push ::Middleman::Sitemap::Extensions::RedirectResource
                           .new(
                           @app.sitemap,
                           "guides/#{p}/current/#{c}/index.html",
                           page.path
                         )
        end
      end
    end
    resources + redirects
  end
end

::Middleman::Extensions.register(:category_redirects, CategoryRedirects)
