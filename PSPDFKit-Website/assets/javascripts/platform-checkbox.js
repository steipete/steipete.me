/**
 * input[data-name="platform"]
 *
 * Check the appropriate product on the try/sales form if coming from a product page.
 */

import _ from "underscore";

var ref = document.referrer;
var match = _.first(
  ref.match(/android|ios|macos|web|windows|instant|electron/)
);

$(document).ready(function() {
  if (match) {
    var $input = $('input[data-name="platform"]').filter(function() {
      var value = $(this).attr("data-value") || $(this).attr("value");
      return value.toLowerCase() === match;
    });
    if ($input.length) {
      $input.prop("checked", true);
    }
  }
});
