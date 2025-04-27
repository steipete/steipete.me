import { Controller } from "stimulus";
import Cookies from "js-cookie";
import _ from "underscore";

export default class extends Controller {
  static targets = [
    "recaptchaInput",
    "email",
    "platform",
    "submit"
  ];

  connect() {
    this._trackClientId();
    this.originalSubmitText = $(this.submitTarget).text();
  }

  submit(event) {
    let that = this;
    event.preventDefault();

    this._generateRecaptchaToken().then(function() {
      let $form = $(that.element);
      let url = $form.attr("action");
      let dataType = that.data.get("data-type") || false;
      let data = $form.serialize();

      $.ajax({
        url: url,
        type: "post",
        data: data,
        dataType: dataType,
        processData: false,
        beforeSend: () => that._beforeSend(),
        success: () => that._success(),
        error: xhr => that._error(xhr)
      });
    });
  }

  change(event) {
    $(event.target).removeClass("is-invalid");
  }

  // private

  _beforeSend() {
    $(this.submitTarget)
      .text("Loading...")
      .attr("disabled", true);
  }

  _success() {
    this._identifyIntercomUser();
    this._redirectToSuccessUrl();
  }

  _error(xhr) {
    const errors = xhr.responseJSON;

    if (errors) {
      _.each(errors, (value, key) => {
        _.each(value, (err, field) => {
          $(`#${key}_${field}`)
            .addClass("is-invalid")
            .focus();
        });
      });

      $(this.submitTarget)
        .text(this.originalSubmitText)
        .attr("disabled", false);
    }
  }

  _redirectToSuccessUrl() {
    window.location = this.data.get("success-url");
  }

  // Identify Intercom user so that Licensor can use same Intercom `visitorId` for analytics.
  // See `_intercom.html.erb` for details.
  _identifyIntercomUser() {
    let email = this.emailTarget.value;
    if (email) {
      window.Intercom && Intercom("update", { email: email });
    }
  }

  // Google AdWords offline conversion tracking
  _trackClientId() {
    let gclid = Cookies.get("gclid");
    let name = this.data.get("client-id-name");

    if (gclid) {
      $(this.element).prepend(
        $("<input />", { type: "hidden", name: name, value: gclid })
      );
    }
  }

  // Generate a reCAPTCHA token and insert it into the form.
  // This is validated in Licensor to prevent spam submissions.
  _generateRecaptchaToken() {
    let promise = $.Deferred();
    let key = this.data.get("recaptcha-site-key");
    let action = this.data.get("recaptcha-action");
    let input = this.recaptchaInputTarget;

    grecaptcha.ready(function() {
      grecaptcha.execute(key, { action: action }).then(function(token) {
        input.value = token;
        promise.resolve();
      });
    });

    return promise;
  }
}
