---
title: "Chef on macOS"
section: blog

author: Julian Grosshauser
author_url: https://twitter.com/jgrosshauser
date: 2016-12-19 12:00 UTC
tags: DevOps, Development
published: true
---

At PSPDFKit we're currently using 20 Mac minis to run our continuous integration. Manually setting up these machines is a very time consuming and error prone process. Keeping all these machines in sync by hand is almost impossible. That's why we're using [Chef](https://www.chef.io) to describe our infrastructure in code.
READMORE

![](/images/blog/2016/chef-on-macos/converging.gif)

Over the years we grew from using 2 Mac minis to around 20, hosted in various data centers around the world. These 2 Macs were running several virtual machines, so we could run more jobs in parallel, but we ran into various issues with our Jenkins connection and the iOS Simulator. Running one job on one machine at a time without virtualization has proven the most reliable.

The reason we have so many machines is the sheer number of different Jenkins jobs we need to run on them. We have Jenkins jobs for iOS tests (with and without [ASAN and TSAN enabled](https://pspdfkit.com/blog/2016/test-with-asan)), tvOS tests, watchOS tests, macOS tests, Android tests, C++ tests, tests targeting different web browsers, [Elixir tests](https://pspdfkit.com/blog/2016/testing-http-apis-in-elixir), [end-to-end tests](https://pspdfkit.com/blog/2016/e2e-testing) for our sync platform and several jobs building releases of all our different products.

We needed a reliable and reproducible way to set up these machines. We started writing our macOS setup with [Ansible](https://www.ansible.com), because it seemed like a simpler solution at the time. But we soon realized that writing Ruby code in Chef recipes is way more powerful than the YAML syntax in Ansible playbooks. Chef's [Supermarket](https://supermarket.chef.io) is also a big advantage. Using recipes from cookbooks like [homebrew](https://supermarket.chef.io/cookbooks/homebrew) and [build-essential](https://supermarket.chef.io/cookbooks/build-essential) is a huge timesaver.

This post is meant to help you get started with Chef on macOS, not to be a Chef tutorial. If you've never used Chef please take a look at their [documentation](https://learn.chef.io) first. We assume that you have installed the [Chef DK](https://downloads.chef.io/chefdk) and already created a cookbook for you to work in.

## Add a Test Kitchen

A Test Kitchen allows you to test your cookbook in a temporary environment that resembles production.
Think of it as a virtual machine in which you confirm that things are working before you deploy your code to a production environment.
The workflow is as follows:

1. `kitchen create`: Test Kitchen creates your virtual environment.
2. `kitchen converge`: Test Kitchen applies your cookbook to your virtual environment.
3. `kitchen login`: Test Kitchen creates an SSH session into your virtual environment.
4. You manually verify that the virtual environment is correctly configured.
5. `kitchen destroy`: Test Kitchen destroys your virtual environment.

In order for Test Kitchen to create a virtual environment, we first need to create a macOS base box.

### Requirements

You can use VMware Fusion, Parallels or VirtualBox. We're going to use VMware Fusion, but you can find the commands for the other virtualization solutions in the README of the GitHub repositories.

* [Vagrant](https://www.vagrantup.com)
* [Vagrant's VMware Fusion Provider](https://www.vagrantup.com/vmware)
* [VMware Fusion](http://www.vmware.com/products/fusion.html)
* [Packer](https://www.packer.io)

### Preparing the ISO

1. Download macOS Sierra from the App Store to get `Install macOS Sierra.app`.
2. Clone [`https://github.com/timsutton/osx-vm-templates`](https://github.com/timsutton/osx-vm-templates).
3. In `osx-vm-templates` execute

```bash
sudo prepare_iso/prepare_iso.sh "/Applications/Install macOS Sierra.app" out
```

You will need the MD5 checksum and location of the .dmg found in the output.

### Building the macOS box

1. Clone [`https://github.com/chef/bento`](https://github.com/chef/bento).
2. In `bento` execute

```bash
packer build -only=vmware-iso -var 'iso_checksum=<checksum>' -var 'iso_url=<iso_url>' macosx-10.12.json
```

Insert the checksum and ISO URL from the output of the `prepare_iso.sh` command.

### Import Base Box

Import box to Vagrant:

```bash
vagrant box add macos-10.12 builds/macos-10.12.vmware.box
```

### Add Test Kitchen Configuration

To configure the Test Kitchen add a `.kitchen.yml` to the cookbook:

```yaml
---
driver:
  name: vagrant

provisioner:
  name: chef_zero

platforms:
  - name: macos-10.12
    driver:
      provider: vmware_fusion
      vm_hostname: macmini01

suites:
  - name: default
    run_list:
      - recipe[pspdfkit-ci-macos::default]
```

## Installing Xcode

A common task on macOS is to install Xcode, which is a fairly complicated procedure, but all the heavy lifting in our `xcode.rb` recipe is handled by the [`xcode-install` gem](https://github.com/KrauseFx/xcode-install).
It downloads and unpacks Xcode, accepts the license, installs command line tools and even simulators.

In `attributes/default.rb` we define what Xcode and simulator versions we want to install:

```rb
default['pspdfkit-ci-macos']['xcode']['version'] = '8.2'
default['pspdfkit-ci-macos']['xcode']['build_version'] = '8C38'
default['pspdfkit-ci-macos']['xcode']['beta'] = false
default['pspdfkit-ci-macos']['xcode']['simulators'] = [
  'iOS 9.0',
  'iOS 9.1',
  'iOS 9.2',
  'iOS 9.3',
  'iOS 10.0',
  'iOS 10.1'
]
```

The `xcode.rb` recipe then installs our specified Xcode version. `xcode-install` needs credentials to access the Apple Developer Center. We save those credentials as data bag items and then set them as environment variables:

```rb
temporary_xcode_path = "/Applications/Xcode-#{node['pspdfkit-ci-macos']['xcode']['version'].split(' ')[0]}.app"
final_xcode_path = "/Applications/Xcode#{'-beta' if node['pspdfkit-ci-macos']['xcode']['beta']}.app"

environment = {
  'XCODE_INSTALL_USER' => data_bag_item('credentials', 'apple_id')['user'],
  'XCODE_INSTALL_PASSWORD' => data_bag_item('credentials', 'apple_id')['password']
}

gem_package 'xcode-install'

execute 'xcversion_update' do
  command 'xcversion update'
  environment environment
  not_if { xcode_installed? }
end

execute 'xcversion_install' do
  command "xcversion install \"#{node['pspdfkit-ci-macos']['xcode']['version']}\" --no-switch --no-progress"
  environment environment
  creates temporary_xcode_path
  not_if { xcode_installed? }
end

directory final_xcode_path do
  recursive true
  action :nothing
  subscribes :delete, 'execute[xcversion_install]', :immediately
end

execute "mv #{temporary_xcode_path} #{final_xcode_path}" do
  only_if "test -d #{temporary_xcode_path}"
  action :nothing
  subscribes :run, 'execute[xcversion_install]', :immediately
end

execute 'xcode_select' do
  command "xcode-select -s #{final_xcode_path}/Contents/Developer"
  action :nothing
  subscribes :run, "execute[mv #{temporary_xcode_path} #{final_xcode_path}]", :immediately
end

# xcode-install accepts the license, but fails sometimes.
execute 'license' do
  command 'xcodebuild -license accept'
  action :nothing
  subscribes :run, 'execute[xcode_select]', :immediately
end
```

The `xcode_installed?` method is a helper we define in `libraries/helper.rb`. It parses the output of `xcversion installed` to check if the specified Xcode version is already installed:

```rb
module PspdfkitCiMacos
  # Helper methods for recipes
  module Helper
    def xcode_installed?
      # > xcversion installed
      # 7.3 (/Applications/Xcode.app)
      #
      # irb(main):001:0> installed_xcodes = `xcversion installed`.split(/\s+/).reject!.with_index { |_, i| i.even? } || []
      # => ["(/Applications/Xcode.app)"]
      installed_xcodes = shell_out!('xcversion installed').stdout.split(/\s+/).reject!.with_index { |_, i| i.even? } || []

      installed_xcode_versions = installed_xcodes.map do |xcode|
        # Remove brackets by removing first and last character
        path = xcode[1..-2]
        shell_out!("DEVELOPER_DIR=#{path} xcodebuild -version").stdout.split.last
      end

      installed_xcode_versions.include?(node['pspdfkit-ci-macos']['xcode']['build_version'])
    end
  end
end

::Chef::Resource.send(:include, PspdfkitCiMacos::Helper)
```

Simulator installation is done in the `simulators.rb` recipe:

```rb
node['pspdfkit-ci-macos']['xcode']['simulators'].each do |simulator|
  execute "install_simulator_#{simulator}" do
    command "xcversion simulators --install='#{simulator}'"
      not_if { shell_out!('xcversion simulators').include?("#{simulator} Simulator (installed)") }
    end
  end
end
```

## Manage Rubies with rbenv

We define the Ruby version and gems to install in `attributes/default.rb`:

```rb
default['pspdfkit-ci-macos']['ruby']['version'] = '2.3.3'
default['pspdfkit-ci-macos']['ruby']['gems'] = %w(
  bundler
)
```

You can use a [cookbook](https://github.com/chef-rbenv/ruby_rbenv) to install [rbenv](https://github.com/rbenv/rbenv), but on macOS it's easier to simply use Homebrew instead:

```rb
ruby_version = node['pspdfkit-ci-macos']['ruby']['version']
ci_user = 'ci'
ci_home = '/Users/ci'
environment = {
  'HOME' => ci_home,
  'USER' => ci_user,
  'PATH' => "#{ci_home}/.rbenv/shims:#{ENV['PATH']}"
}

package 'rbenv'

execute 'rbenv_install' do
  command "rbenv install #{ruby_version}"
  user ci_user
  environment environment
  not_if "rbenv versions | grep #{ruby_version}"
end

directory "#{ci_home}/.rbenv" do
  owner ci_user
end

# Set global Ruby version.
file "#{ci_home}/.rbenv/version" do
  content ruby_version
  owner ci_user
end

node['pspdfkit-ci-macos']['ruby']['gems'].each do |gem|
  execute "install_#{gem}" do
    command "gem install #{gem}"
    user ci_user
    environment environment
    not_if "gem list | grep #{gem}"
  end
end
```

Notice the use of the `environment` hash: Without it `rbenv` isn't initialized and gems wouldn't be installed for the correct Ruby version.

## Disable sleep and the screensaver

Another thing you want to do on your CI machines is to disable sleep and the screensaver:

```rb
ci_user = 'ci'

execute "deactivate_screensaver" do
  command 'defaults -currentHost write com.apple.screensaver idleTime 0'
  user ci_user
  not_if 'defaults -currentHost read com.apple.screensaver idleTime | grep -w 0', user: ci_user
end

execute 'disable_sleep' do
  command 'pmset -a sleep 0'
  not_if 'pmset -g | grep -w sleep | grep -w 0'
end
```

## Chef Supermarket Cookbooks

The [Chef Supermarket](https://supermarket.chef.io) contains a few cookbooks that are especially interesting on macOS:

### build-essential

The [`build-essential` cookbook](https://supermarket.chef.io/cookbooks/build-essential) installs packages required for compiling C software from source. In the case of macOS it installs the Xcode command line tools. This cookbook is important if you want to install Xcode with the `xcode-install` gem, because `xcode-install` has a dependency on a gem with native extensions, which means you need the Xcode command line tools to build it. So you need to run the `build-essential::default` recipe before installing the `xcode-install` gem.

### homebrew

The [`homebrew` cookbook](https://supermarket.chef.io/cookbooks/homebrew) installs [Homebrew](http://brew.sh) and under Chef 11 the Homebrew package provider is set as the default package provider. Installing the Android SDK for example is as easy as `package android-sdk`.

### mac-app-store

The [`mac-app-store` cookbook](https://supermarket.chef.io/cookbooks/mac-app-store) uses the [`mas` CLI tool](https://github.com/mas-cli/mas) to install apps from the Mac App Store.

## Conclusion

We hope that our tips and code snippets help you set up your own macOS CI machines with Chef. Feel free to reach out to me on [Twitter](https://twitter.com/jgrosshauser) if you're having questions or want to share your own tips with us.
