// Prevent CSS animations firing until page is loaded
$(document).ready(function() {
  $("body").removeClass("preload");
});

// Animate in elements on scroll
$(document).ready(function() {
  $(".animated").on("inview", function(e, isInView) {
    $(e.target).toggleClass("go", isInView);
  });
});
