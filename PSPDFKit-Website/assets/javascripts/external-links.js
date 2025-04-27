//
// a[href]
// Open external links in new tab.
//

$(document).ready(function() {
  $('a[href*="//"]:not([href*="pspdfkit.com"])')
    .addClass("link-external")
    .attr("target", "_blank")
    .attr("rel", "noopener");
});
