require 'active_support'
require 'active_support/core_ext'
require 'capybara/rspec'
require 'sinatra/base'

class FakeLicenseServer < Sinatra::Base
  def self.boot(license)
    @@license = license
    instance = new
    Capybara::Server.new(instance, '3000').tap(&:boot)
  end

  get '/api/demo_license/xyz' do
    headers 'Access-Control-Allow-Origin' => '*'
    content_type :json
    @@license.to_json
  end
end
