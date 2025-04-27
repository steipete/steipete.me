/**
 * [data-platform="name"]
 *
 * Switch to the corresponding guide page for another platform (if available).
 */

import _ from "underscore";

$(document).on("click", "[data-guide-platform]", switchPlatform);

// The platforms where the current guide page is available
var availablePlatforms = $.parseJSON(
  $("meta[name=pspdf-available-platforms]").attr("content") || "{}"
);

// The current platform
var currentPlatform = $("meta[name=pspdf-platform]").attr("content");

// Some pages are the 'same' but have different urls on other platforms
var alternatePlatformLinks = $.parseJSON(
  $("meta[name=pspdf-alternate-platform-links]").attr("content") || "{}"
);

function switchPlatform(e) {
  e.preventDefault();
  var $target = $(e.currentTarget);

  // The actual href of the link => '/guides/android/current/'
  // We fallback to this if nothing below matches.
  var url = $target.attr("href");

  // The platform we are switching to => 'android'
  var platform = $target.data("guide-platform");

  // Lookup the alternate link, if available => 'getting-started/integrating-pspdfkit'
  var alternateLink = alternatePlatformLinks[platform];

  // Is the current guide page available on the desired platform?
  if (_.contains(availablePlatforms, platform)) {
    // The full path to the current page => /guides/ios/current/pspdfkit-for-web/getting-started/
    var pathname = window.location.pathname;

    // The 'chapter' and 'guide' segments of the path => pspdfkit-for-web/getting-started
    var pagePath = _.last(_.compact(pathname.split("/")), 2).join("/");

    // If the link is different we need to replace both the page and platform segments
    if (alternateLink) {
      url = pathname
        .replace(pagePath, alternateLink)
        .replace(currentPlatform, platform);
      // If the link is the same we only need to replace the platform segment
    } else {
      url = pathname.replace(currentPlatform, platform);
    }
  }

  // Open the final url, preserving the option to open it in a new tab/window
  if (e.metaKey) {
    window.open(url);
  } else {
    window.location = url;
  }
}
