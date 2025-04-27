import "cookieconsent";
import Cookies from "js-cookie";

window.addEventListener("load", function() {
  window.cookieconsent.initialise({
    content: {
      message:
        "This website uses cookies to ensure you get the best experience possible. By clicking accept below or continuing to view our website, you agree to the terms of our privacy policy and the use of cookies.",
      href: "/legal/privacy",
      dismiss: "Got it"
    },
    elements: {
      messagelink:
        '<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}">{{link}}</a></span>'
    },
    law: {
      regionalLaw: true
    },
    theme: "classic",
    position: "bottom-left",
    palette: {
      popup: {
        background: "#343a40"
      },
      button: {
        background: "#267ad3"
      }
    },
    onPopupOpen: function() {
      Cookies.set("cookieconsent_status", "dismiss", { expires: 365 });
    }
  });
});
