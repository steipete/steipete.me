import { Controller } from "stimulus";

export default class extends Controller {
  connect() {
    if (this.data.get("autoplay")) {
      $(this.element).on("inview", (event, isInView) => {
        this._autoplay(isInView);
      });
    }
  }

  // private

  _autoplay(isInView) {
    isInView ? this.element.play() : this.element.pause();
  }
}
