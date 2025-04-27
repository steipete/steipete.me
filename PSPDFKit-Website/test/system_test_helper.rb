require 'rspec'
require 'capybara/rspec'
require 'selenium/webdriver'
require 'webdrivers'
require 'middleman-core'
require 'middleman-core/rack'
require 'middleman-blog'
require 'middleman/search_engine_sitemap'
require 'middleman/redirects'

Capybara.server = 'webrick'
Capybara.server_host = 'localhost'
Capybara.server_port = '4567'
Capybara.default_driver = :selenium_headless
Capybara.javascript_driver = :selenium_headless
Capybara.ignore_hidden_elements = false

middleman_app = ::Middleman::Application.new

Capybara.app =
  ::Middleman::Rack.new(middleman_app).to_app do
    set :root, File.expand_path(File.join(File.dirname(__FILE__), '..'))
    set :environment, :development
    set :show_exceptions, false
  end
