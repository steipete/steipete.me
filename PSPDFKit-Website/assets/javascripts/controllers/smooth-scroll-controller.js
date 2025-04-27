import { Controller } from "stimulus";
import SmoothScroll from "smooth-scroll";

export default class extends Controller {
  connect() {
    var scroll = new SmoothScroll('.nav-sub a[href*="#"]', {
      offset: 60
    });

    $("body").scrollspy({ target: ".nav-sub", offset: 61 });
  }
}
