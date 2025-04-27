$(document).on("click", ".anchorable > span", function(e) {
  e.preventDefault();
  var id = $(this).attr("id");
  window.location.hash = id;
});
