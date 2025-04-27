xml.instruct!
xml.feed "xmlns" => "http://www.w3.org/2005/Atom" do
  site_url = "https://pspdfkit.com/"
  xml.title "Inside PSPDFKit"
  xml.id URI.join(site_url, blog('default').options.prefix.to_s)
  xml.link "href" => URI.join(site_url, blog('default').options.prefix.to_s)
  xml.link "href" => URI.join(site_url, current_page.path), "rel" => "self"
  xml.updated(blog('default').articles.first.date.to_time.iso8601) unless blog('default').articles.empty?
  xml.author { xml.name "pspdfkit.com" }

  blog('default').articles.reject {|a| a.data[:secret] }[0..5].each do |article|
    xml.entry do
      xml.title article.title
      xml.link "rel" => "alternate", "href" => URI.join(site_url, article.url)
      xml.id URI.join(site_url, article.url)
      xml.published article.date.to_time.iso8601
      xml.updated File.mtime(article.source_file).iso8601
      if article.data.author.nil? 
        xml.author "PSPDFKit"
      else
        xml.author { xml.name article.data.author.join(", ") }
      end
      # We use article.render and not article.body to supply an extra within_feed option
      # so that different key is used for caching. This way we avoid cache conflict for
      # feed and regular version of the article body.
      xml.content article.render(layout: false, within_feed: true), "type" => "html"
    end
  end
end
