$(document).on("click", "video", function(e) {
  let video = e.currentTarget;
  video.paused ? video.play() : video.pause();
  $(video)
    .parents(".video-player")
    .toggleClass("is-playing", !video.paused);
  video.onended = function(e) {
    $(e.currentTarget)
      .parents(".video-player")
      .removeClass("is-playing");
  };
});
