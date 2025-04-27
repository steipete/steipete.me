import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["checkboxGroup", "submit"];

  // Ensure that submit button is enabled when navigating back to a valid form.
  connect() {
    this._toggleSubmitButton(this.element.checkValidity());
  }

  beforeSubmit(event) {
    this._validateCheckboxGroups(event);
  }

  // Enable submit button when a valid value is entered.
  change(event) {
    this._validateCheckboxGroups();
    this._toggleSubmitButton(this.element.checkValidity());
  }

  // private

  _toggleSubmitButton(state) {
    $(this.submitTarget).prop("disabled", !state);
  }

  // Ensure at least one checkbox in a group is checked.
  _validateCheckboxGroups() {
    this.checkboxGroupTargets.forEach(group => {
      let $checkboxes = $(group).find('input[type="checkbox"]');
      let msg = $checkboxes.is(":checked")
        ? ""
        : "Please select at least one option.";
      $checkboxes
        .first()
        .get(0)
        .setCustomValidity(msg);
    });
  }
}
