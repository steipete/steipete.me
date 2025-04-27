import { Controller } from "stimulus";
import Cookies from "js-cookie";
import _ from "underscore";

export default class extends Controller {
  static platforms = ["ios", "android"];

  connect() {
    $(window).on("hashchange.platform-switcher", () => {
      this.onHashChange();
    });
    $(window).trigger("hashchange");
  }

  disconnect() {
    $(window).off("hashchange.platform-switcher");
  }

  change(event) {
    this.platform = $(event.currentTarget).data("target");
  }

  // private

  onHashChange() {
    $('[data-action="click->platform-switcher#change"]').removeClass("active");
    $("[data-target=" + this.platform + "]").addClass("active");
    $("[data-platform]").addClass("hidden");
    $("[data-platform*=" + this.platform + "]").removeClass("hidden");
  }

  get platform() {
    let hash = window.location.hash.replace("#", "");
    let cookie = Cookies.get("platform-switcher-platform");

    if (hash && _.includes(this.constructor.platforms, hash)) {
      return hash;
    }

    return cookie || this.constructor.platforms[0];
  }

  set platform(platform) {
    window.location.hash = platform;
    Cookies.set("platform-switcher-platform", platform);
  }
}
