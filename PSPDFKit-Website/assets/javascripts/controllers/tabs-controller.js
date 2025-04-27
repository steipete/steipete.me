import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["tab", "pane"];

  connect() {
    this._activate(window.location.hash, false);
  }

  show(event) {
    this._activate(event.currentTarget.getAttribute("href"));
    event.preventDefault();
  }

  back(event) {
    this._activate(window.location.hash, false);
  }

  // private

  _activate(hash, push = true) {
    const [index, anchor] = this._findTarget(hash);
    this._activateTab(index);
    this._activatePane(index);
    if (push) {
      window.history.pushState(null, null, anchor);
    }
  }

  _activateTab(index) {
    this.tabTargets.forEach((el, i) => {
      el.classList.toggle("active", index == i);
    });
  }

  _activatePane(index) {
    this.paneTargets.forEach((el, i) => {
      el.classList.toggle("active", index == i);
    });
  }

  _findTarget(hash) {
    const target =
      this.tabTargets.find(el => el.getAttribute("href") == hash) ||
      this.tabTargets[0];
    const index = this.tabTargets.indexOf(target);
    const anchor = target.getAttribute("href");
    return [index, anchor];
  }
}
