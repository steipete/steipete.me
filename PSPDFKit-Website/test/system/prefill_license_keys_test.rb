require_relative '../system_test_helper'
require_relative '../support/fake_license_server'

describe 'prefill license keys', type: :feature do
  let(:ios_license) do
    {
      platform: 'ios',
      license_key: 'ZtMIXQ',
      cocoapods_key: 'TRIAL-snx7a',
      token: 'TRIAL-snx7a',
      expires_at: '2019-07-01',
      email: 'ios@example.com'
    }
  end

  let(:android_license) do
    {
      platform: 'android',
      license_key: 'ZtMIXQ',
      maven_key: 'TRIAL-snx7a',
      token: 'TRIAL-snx7a',
      expires_at: '2019-07-01',
      email: 'android@example.com'
    }
  end

  context 'with license token in url' do
    before do
      FakeLicenseServer.boot(ios_license)
      execute_script('Date.now = function() { return 1561939200000 }')
      visit '/guides/ios/current/getting-started/try-the-demo/#ios_token=xyz'
    end

    it 'fetches license data from Licensor API', js: true do
      assert_selector(
        '.alert-warning strong',
        text: "We've prefilled information from your trial license:"
      )

      stored_ios_license =
        evaluate_script("window.localStorage.getItem('demo_ios_license')")
      expect(JSON.parse(stored_ios_license).symbolize_keys).to eq(ios_license)
    end
  end

  context 'with `clear` token in url' do
    before do
      visit '/guides/ios/current/'
      execute_script(
        "window.localStorage.setItem('demo_ios_license', '#{
          ios_license.to_json
        }')"
      )
      execute_script(
        "window.localStorage.setItem('demo_android_license', '#{
          android_license.to_json
        }')"
      )
    end

    it 'resets stored license data for platform' do
      visit '/guides/ios/current/getting-started/try-the-demo/#ios_token=clear'
      stored_ios_license =
        evaluate_script("window.localStorage.getItem('demo_ios_license')")

      expect(stored_ios_license).to be(nil)
    end

    it 'does not reset stored license data for other platforms' do
      visit '/guides/ios/current/getting-started/try-the-demo/#ios_token=clear'
      stored_android_license =
        evaluate_script("window.localStorage.getItem('demo_android_license')")

      expect(JSON.parse(stored_android_license).symbolize_keys).to eq(
        android_license
      )
    end
  end

  context 'with active license data saved in localStorage' do
    before do
      visit '/guides/ios/current/'
      execute_script('Date.now = function() { return 1561939200000 }')
      execute_script(
        "window.localStorage.setItem('demo_ios_license', '#{
          ios_license.to_json
        }')"
      )
      visit '/guides/ios/current/getting-started/try-the-demo/'
    end

    it 'shows message that trial is active' do
      assert_selector(
        '.alert-warning',
        text:
          'Your trial license is registered to ios@example.com and expires on 2019-07-01.'
      )
    end

    it 'shows link to trial guide' do
      assert_selector(
        '.alert-warning',
        text: 'Refer to the trial guide for help getting started'
      )
    end

    it 'lists which tokens were replaced' do
      within('.alert-warning', match: :first) do
        assert_selector(
          'strong',
          text: "We've prefilled information from your trial license:"
        )
        keys = find_all('li', count: 2)
        keys.first.assert_text('COCOAPODS_KEY')
        keys.last.assert_text('LICENSE_KEY')
        assert_selector(
          'p.small',
          text:
            'Your trial license is registered to ios@example.com and expires on 2019-07-01.'
        )
      end
    end

    it 'replaces and highlights tokens in code blocks' do
      within('.code-block.lang-ruby', match: :first) do
        assert_text(
          'https://customers.pspdfkit.com/cocoapods/TRIAL-snx7a/latest.podspec'
        )
        assert_selector('mark', text: 'TRIAL-snx7a')
      end

      within find('.code-block.lang-swift', match: :first) do
        find('.code-table').assert_text('PSPDFKit.setLicenseKey("ZtMIXQ")')
        find('.code-table').assert_selector('mark', text: 'ZtMIXQ')
      end

      within find('.code-block.lang-objc', match: :first) do
        find('.code-table').assert_text('[PSPDFKit setLicenseKey:@"ZtMIXQ"];')
        find('.code-table').assert_selector('mark', text: 'ZtMIXQ')
      end
    end

    it 'replaces tokens in download links' do
      within('.force-replace-tokens', match: :first) do
        find('a[href="https://customers.pspdfkit.com/download/TRIAL-snx7a"]')
          .assert_text('download the disk image (dmg)')
      end
    end
  end

  context 'with expired license data saved in localStorage' do
    before do
      visit '/guides/ios/current/'
      execute_script('Date.now = function() { return 1561939200000 }')
      execute_script(
        "window.localStorage.setItem('demo_ios_license', '#{
          ios_license.merge({ expires_at: '2019-05-01' }).to_json
        }')"
      )
      visit '/guides/ios/current/getting-started/try-the-demo/'
    end

    it 'shows message that trial is expired' do
      assert_selector('.alert-warning', text: 'Your trial license has expired')
    end

    it 'shows link to trial form' do
      assert_selector('.alert-warning', text: 'Get a new trial license')
    end
  end
end
