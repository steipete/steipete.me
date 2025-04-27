import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["code"];

  copy(event) {
    let $btn = $(event.currentTarget);
    let text = $(this.codeTargets)
      .filter(":visible")
      .text();
    this._copyTextToClipboard(text).always(msg => {
      this._showTooltip($btn, msg);
    });
  }

  hover(event) {
    let $btn = $(event.currentTarget);
    this._showTooltip($btn, "Copy to clipboard");
  }

  // private

  _showTooltip($btn, title) {
    $btn.tooltip("dispose");
    $btn.tooltip({ title: title, animation: false });
    $btn.tooltip("show");
  }

  _copyTextToClipboard(text) {
    let promise = new $.Deferred();
    let textArea = document.createElement("textarea");

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      promise.resolve("Copied!");
    } catch (err) {
      promise.reject("Oops, unable to copy");
    }

    document.body.removeChild(textArea);
    return promise;
  }
}
