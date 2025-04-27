import { Controller } from "stimulus";
import Cookies from "js-cookie";

export default class extends Controller {
  connect() {
    if (Cookies.get("pspdfkit_team") === "true") {
      this.element.classList.remove("invisible");
    }
  }
}
