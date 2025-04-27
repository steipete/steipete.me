$(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]')
    .popover({
      offset: "0, 5",
      html: true,
      trigger: "manual",
      sanitizeFn: function(content) {
        return content;
      },
      content: function() {
        var selector = $(this).data("target");
        return $(selector).html();
      }
    })
    .on("click", function(e) {
      e.preventDefault();
      $(this).popover("toggle");
    })
    .on("show.bs.popover", function(e) {
      $(this).addClass("active");
    })
    .on("hide.bs.popover", function(e) {
      $(this).removeClass("active");
    });
});
