require 'json'

::LICENSE_API_URL = ENV['LICENSE_API_URL'] || 'https://customers.pspdfkit.com/api/'
::PLATFORMS = %w[ios android web windows macos server dotnet java]
::VERSIONS = JSON.parse(File.read('source/versions.json'))
::GUIDE_CONSTANTS = JSON.parse(File.read('source/guide_constants.json'))
::GUIDES_PLATFORM = ENV['GUIDES_PLATFORM']
::GUIDES_VERSION = ENV['GUIDES_VERSION']
::INTERCOM_APP_ID = ENV['PSPDFKIT_ENV'] == 'production' ? 'k2d765xf' : 'ukk6kv68'
::GOOGLE_ANALYTICS_PROPERTY_ID = ENV['PSPDFKIT_ENV'] == 'production' ? 'UA-57640592-1' : 'UA-57640592-2'
::GOOGLE_RECAPTCHA_SITE_KEY = ENV['PSPDFKIT_ENV'] == 'production' ? '6Lf5UsMUAAAAACO2DDjuK1xArzYHbwvqSGRxSgzO' : '6LckWcMUAAAAADyiVmYco0lMi2ReiwuOfE7xp2HC'
::ASSET_HOST = ENV['ASSET_HOST']
