//
// [data-behavior="version-select"]
// Switch between different versions of the guides.
//

var $select = $('[data-behavior="version-select"]');
var versionsUrl = $("meta[name=pspdf-versions-url]").attr("content");

if ($select.length) {
  $.ajax(versionsUrl).done(onData);
}

function onData(data) {
  var platform = $("meta[name=pspdf-platform]").attr("content");
  var availableVersions = data[platform].reverse().map(function(v) {
    return v.match(/(\d+.\d+)/)[0]; // discard the patch number
  });
  var activeVersion = $("meta[name=pspdf-version]").attr("content");
  var latestVersion = availableVersions[0];

  switch (activeVersion) {
    case "nightly":
      activeVersion = "nightly";
      availableVersions.unshift("nightly");
      break;
    case "current":
      activeVersion = latestVersion;
      break;
  }

  $select
    .append(
      availableVersions.map(function(v) {
        var text = v == "nightly" ? v : "v" + v;
        return $("<option>", { value: v, text: text });
      })
    )
    .val(activeVersion);

  $select.on("change", function(e) {
    var version = e.target.value;
    var url = window.location.href;
    // var url =  window.location.href + 'ios/5.1' // debug

    if (version === latestVersion) {
      version = "current";
    }

    url = url
      .replace(activeVersion, version)
      .replace(/current|nightly/, version);

    var req = $.ajax({ type: "HEAD", url: url });

    req.done(function() {
      window.location = url;
    });

    req.fail(function() {
      window.alert(
        "This article is not available in the " + version + " guides"
      );
      $select.val(activeVersion);
    });
  });
}
