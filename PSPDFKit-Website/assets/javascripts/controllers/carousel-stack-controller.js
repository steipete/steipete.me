import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["items", "item"];

  connect() {
    this.itemsTarget.classList.add("initialized");

    setInterval(() => {
      this.show();
    }, 4000);
  }

  show() {
    let indexes = this.itemTargets.map((el, index) => el.dataset.step);
    let last = indexes.pop();
    indexes.unshift(last);
    this.itemTargets.forEach((el, i) => (el.dataset.step = indexes[i]));
  }
}
