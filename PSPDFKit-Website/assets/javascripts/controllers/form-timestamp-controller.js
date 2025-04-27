import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["field"];

  initialize() {
    this.fieldTarget.value = Date.now();
  }
}
