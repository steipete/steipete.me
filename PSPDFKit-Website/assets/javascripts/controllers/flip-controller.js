import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["surface"];

  connect() {
    if (window.location.hash) {
      this.show();
    }
  }

  show() {
    this.surfaceTarget.classList.add("flip");
  }

  back() {
    this.surfaceTarget.classList.remove("flip");
  }
}
