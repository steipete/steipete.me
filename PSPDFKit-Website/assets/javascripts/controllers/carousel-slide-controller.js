import { Controller } from "stimulus";
import smoothscroll from "smoothscroll-polyfill";
import _ from "underscore";

smoothscroll.polyfill();

export default class extends Controller {
  static targets = ["scroller", "item", "indicator"];

  connect() {
    this.index = 0;
    this.width = this.scrollerTarget.scrollWidth;

    this.scrollerTarget.addEventListener(
      "scroll",
      _.debounce(() => {
        const index = Math.round(
          (this.scrollerTarget.scrollLeft / this.width) *
            this.itemTargets.length
        );
        this.activateIndicator(index);
      }, 100)
    );

    this.activate(this.index);
  }

  to(event) {
    event.preventDefault();
    this.index = parseInt(event.currentTarget.dataset.carouselSlideIndex, 10);
    this.activate(this.index);
  }

  prev(event) {
    if (this.index > 0) {
      this.index = this.index - 1;
    } else {
      this.index = this.itemTargets.length - 1;
    }

    this.activate(this.index);
  }

  next(event) {
    if (this.index < this.itemTargets.length - 1) {
      this.index = this.index + 1;
    } else {
      this.index = 0;
    }

    this.activate(this.index);
  }

  activate(index) {
    this.activateSlide(index);
    this.activateIndicator(index);
  }

  activateSlide(index) {
    this.scrollerTarget.scrollTo({
      left: Math.floor(this.width * (index / this.itemTargets.length)),
      behavior: "smooth"
    });
  }

  activateIndicator(index) {
    this.indicatorTargets.forEach((el, i) => {
      el.classList.toggle("active", index == i);
    });
  }
}
