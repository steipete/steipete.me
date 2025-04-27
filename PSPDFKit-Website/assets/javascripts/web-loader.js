import loadScript from "load-script";
import "jquery-qrcode/dist/jquery-qrcode.js";

$(document).ready(function() {
  var $containers = $("[data-pspdfkit-web-container]");

  if (!$containers.length) {
    return;
  }

  loadPSPDFKitWeb($containers).then(function(res) {
    $("[data-pspdfkit-web-qr]").qrcode({
      render: "div",
      ecLevel: "M",
      text: res.url
    });

    $("[data-pspdfkit-web-document-id]").text(res.encodedDocumentId);
    $("[data-pspdfkit-web-link]")
      .attr("href", res.url)
      .addClass("in");

    $("[data-pspdfkit-web-url]")
      .val(res.url)
      .on("click", function() {
        $(this).select();
      });

    $(document).on("inserted.bs.popover", function() {
      $("[data-pspdfkit-web-url]")
        .val(res.url)
        .on("click", function() {
          $(this).select();
        });
    });
  });
});

var loadPSPDFKitWeb = function($containers) {
  var apiUrl = $containers.attr("data-api-url");

  return $.when(loadDocument(apiUrl), loadJS()).then(function(res) {
    onSuccess(res, $containers);
    return res[0];
  }, onError);
};

var onSuccess = function(res, $containers) {
  var apiRes = res[0];

  var toolbarItems = PSPDFKit.defaultToolbarItems;
  var pagerIndex = toolbarItems.findIndex(function(item) {
    return item.type == "pager";
  });
  toolbarItems.splice(pagerIndex + 1, 0, {
    type: "layout-config",
    mediaQueries: ["(min-width: 769px)"]
  });

  // Init Browser
  $containers.each(function(index, container) {
    PSPDFKit.load({
      authPayload: { jwt: apiRes.jwt },
      documentId: apiRes.documentId.toString(),
      container: container,
      instant: true,
      toolbarItems: toolbarItems
    });
  });
};

var loadDocument = function(apiUrl) {
  return $.post(apiUrl, { crossDomain: true });
};

var loadJS = function() {
  var deferred = $.Deferred();
  loadScript("https://web-preview-server.pspdfkit.com/pspdfkit.js", function() {
    deferred.resolve();
  });
  return deferred.promise();
};

var onError = function() {
  window.location.reload();
};
