import { Controller } from "stimulus";
import Cookies from "js-cookie";

export default class extends Controller {
  connect() {
    Cookies.set("pspdfkit_team", true, {
      domain: ".pspdfkit.com",
      expires: 365 * 20
    });
    window.location = "/";
  }
}
