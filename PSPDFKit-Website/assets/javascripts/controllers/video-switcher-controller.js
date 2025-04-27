import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["button", "video"];

  change(event) {
    this.index = this.buttonTargets.indexOf(event.currentTarget);
  }

  showVideo() {
    this.buttonTargets.forEach((button, index) => {
      const video = this.videoTargets[index];
      button.classList.toggle("active", index == this.index);
      video.classList.toggle("hidden", index != this.index);
      if (index === this.index) {
        $(video)
          .find("video")
          .trigger("click");
      }
    });
  }

  get index() {
    return parseInt(this.data.get("index") || 0);
  }

  set index(value) {
    this.data.set("index", value);
    this.showVideo();
  }
}
