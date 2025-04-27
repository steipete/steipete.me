import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["items", "item"];

  connect() {
    this.itemsTarget.classList.add("initialized");

    this.show(0);

    setInterval(() => {
      let nextIndex = this.index + 1;
      if (nextIndex === this.itemTargets.length) {
        nextIndex = 0;
      }
      this.show(nextIndex);
    }, 3000);
  }

  show(index) {
    this.index = index;
    this.itemTargets.forEach((el, i) => {
      el.classList.toggle("in", index == i);
    });
  }
}
