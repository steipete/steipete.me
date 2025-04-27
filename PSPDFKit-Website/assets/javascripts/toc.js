// "Accordion" behavior for desktop toc navigation
$(document).on("click", '[data-toggle="toc"]', function(e) {
  $(this)
    .parent()
    .find("> .nav-toc")
    .toggleClass("in");

  e.preventDefault();
});

// "Jump menu" behavior for mobile toc navigation
$(document).on("change", "[data-toc-mobile]", function(e) {
  window.location = e.target.value;
});
