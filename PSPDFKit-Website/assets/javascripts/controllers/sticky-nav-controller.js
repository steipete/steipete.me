import { Controller } from "stimulus";

export default class extends Controller {
  connect() {
    this.$el = $(this.element);
  }

  scroll(event) {
    const scroll = $(window).scrollTop();

    if (scroll > 61) {
      this.$el.addClass("is-fixed");
    } else {
      this.$el.removeClass("is-fixed");
    }
  }
}
