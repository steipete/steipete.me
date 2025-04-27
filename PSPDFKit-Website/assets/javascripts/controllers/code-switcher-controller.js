import { Controller } from "stimulus";
import Cookies from "js-cookie";

export default class extends Controller {
  static targets = ["block", "nav"];

  connect() {
    $(document).on("code-switcher:change", (event, lang) => {
      this._activate(lang);
    });
  }

  disconnect() {
    $(document).off("code-switcher:change");
  }

  initialize() {
    this._buildNav();
    this._activate(this.lang);
  }

  change(event) {
    event.preventDefault();
    const lang = $(event.currentTarget).data("code-switcher-lang");
    this._triggerChangeEvent(lang);
    this._preserveScrollPosition();
  }

  // private

  get lang() {
    return Cookies.get("code-switcher-lang");
  }

  set lang(lang) {
    Cookies.set("code-switcher-lang", lang);
  }

  get $tabs() {
    return $(this.navTarget).find(".nav-link");
  }

  get $activeTab() {
    let $tab = this.$tabs.filter(`[data-code-switcher-lang="${this.lang}"]`);
    if ($tab.length < 1) {
      $tab = this.$tabs.first();
    }
    return $tab;
  }

  get $blocks() {
    return $(this.blockTargets);
  }

  get $activeBlock() {
    let $block = this.$blocks.filter(`.lang-${this.lang}`);
    if ($block.length < 1) {
      $block = this.$blocks.first();
    }
    return $block;
  }

  get $prevBlocks() {
    return $(this.element).prevAll(".code-block-group");
  }

  get scrollDelta() {
    if (this.$prevBlocks.length > 0) {
      const delta = this.$prevBlocks
        .get()
        .map(this._calculateHeightDiff)
        .reduce((a, b) => a + b);
      return -delta;
    } else {
      return 0;
    }
  }

  _buildNav() {
    let $newNav;
    let $newTabs = [];
    this.$blocks.each((index, block) => {
      const $nav = $(block).find(".nav-tabs");
      $newTabs.push($nav.find(".nav-item"));
      if (index === 0) {
        $newNav = $nav;
      }
      $nav.remove();
    });
    $(this.element).prepend($newNav.html($newTabs));
  }

  _activate(lang) {
    this.lang = lang;
    this._activateTab();
    this._activateBlock();
  }

  _activateTab() {
    this.$tabs.removeClass("active");
    this.$activeTab.addClass("active");
  }

  _activateBlock() {
    this.$blocks.removeClass("active");
    this.$activeBlock.addClass("active");
  }

  _triggerChangeEvent(lang) {
    $(document).trigger("code-switcher:change", [lang]);
  }

  _preserveScrollPosition() {
    window.scrollBy(0, this.scrollDelta);
  }

  _calculateHeightDiff(group) {
    return (
      $(group)
        .find(".code-block:hidden")
        .height() -
      $(group)
        .find(".code-block:visible")
        .height()
    );
  }
}
