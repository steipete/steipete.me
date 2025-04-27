require 'test_helper'
require 'custom_helpers'

class CustomHelpersTest < Minitest::Test
  include Minitest::Hooks

  before(:all) { @app = Middleman::Application.new }

  def setup
    @helpers = Class.new.extend(CustomHelpers)
  end

  def test_markdown
    assert_equal "<h1 class='anchorable'><span id='test'></span>Test</h1>",
                 @helpers.markdown('# Test')
  end

  def test_platform_name
    assert_equal 'Web', @helpers.platform_name('web')
    assert_equal 'iOS', @helpers.platform_name('ios')
  end

  def test_product_name
    assert_equal 'PSPDFKit for iOS', @helpers.product_name('ios')
    assert_equal 'PSPDFKit Instant', @helpers.product_name('instant')
  end

  def test_product_short_name
    assert_equal 'Web', @helpers.product_short_name('web')
    assert_equal 'iOS', @helpers.product_short_name('ios')
  end

  def test_product_version
    assert_match /^v\d+\.\d+\.\d+$/, @helpers.product_version('ios')
    assert_match /^v\d{4}\.\d+(\.\d+)?$/, @helpers.product_version('web')
  end

  def test_guide_constant
    assert_match /^\d+\.\d+\.\d+$/,
                 @helpers.guide_constant('android', 'android_x_version')
    assert_match /^\d+$/, @helpers.guide_constant('android', 'min_sdk_version')
  end

  def test_latest_version
    assert_match /^\d+\.\d+$/, @helpers.latest_version('ios', :minor)
    assert_match /^\d+$/, @helpers.latest_version('android', :major)
  end

  def test_page_platform
    article = Middleman::Sitemap::Resource.new(@app.sitemap, 'test')
    def article.tags
      %w[Android]
    end
    assert_equal 'android', @helpers.page_platform(article)
  end

  def test_guide_categories
    @helpers.stub(:sitemap, @app.sitemap) do
      assert @helpers.guide_categories('ios', 'current').count > 0
    end
  end

  def test_guide_pages
    @helpers.stub(:sitemap, @app.sitemap) do
      assert @helpers.guide_pages('android', 'current', 'getting-started')
               .count >
               0
    end
  end

  def test_guide_search_index
    @helpers.stub(:sitemap, @app.sitemap) do
      assert JSON.parse(@helpers.guide_search_index('web', 'current')).count > 0
    end
  end

  def test_available_platforms
    article =
      Middleman::Sitemap::Resource.new(
        @app.sitemap,
        '/guides/ios/current/getting-started/integrating-pspdfkit'
      )

    @helpers.stub(:sitemap, @app.sitemap) do
      assert_equal %w[android dotnet ios java macos windows], @helpers.available_platforms(article).sort
    end
  end

  def test_available_platforms_with_alternate_platform_links
    article = Middleman::Sitemap::Resource.new(@app.sitemap, '/guides/ios/test')
    article.add_metadata(
      { page: { alternate_platform_links: { web: '/guides/web/test' } } }
    )

    @helpers.stub(:sitemap, @app.sitemap) do
      assert_equal @helpers.available_platforms(article), %w[web]
    end
  end
end
