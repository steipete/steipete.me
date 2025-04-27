import { Controller } from "stimulus";

export default class extends Controller {
  static targets = [
    "coreViewer",
    "annotations",
    "forms",
    "formDesigner",
    "digitalSignatures",
    "fullTextSearch",
    "documentEditor",
    "replies",
    "imageDocuments",
    "redaction",
    "comparison",
    "instant"
  ];

  check(event) {
    const checked = event.target.checked;

    switch (event.target.value) {
      case "core_viewer":
        if (!checked) {
          this.annotationsTarget.checked = false;
          this.formsTarget.checked = false;
          this.formDesignerTarget.checked = false;
          this.digitalSignaturesTarget.checked = false;
          this.fullTextSearchTarget.checked = false;
          this.documentEditorTarget.checked = false;
          this.repliesTarget.checked = false;
          this.redactionTarget.checked = false;
          this.comparisonTarget.checked = false;
          this.instantTarget.checked = false;
        }
        break;
      case "annotations":
        this.coreViewerTarget.checked = true;
        if (!checked) {
          this.formsTarget.checked = false;
          this.formDesignerTarget.checked = false;
          this.digitalSignaturesTarget.checked = false;
          this.instantTarget.checked = false;
        }
        break;
      case "forms":
        this.coreViewerTarget.checked = true;
        this.annotationsTarget.checked = true;
        if (!checked) {
          this.formDesignerTarget.checked = false;
          this.digitalSignaturesTarget.checked = false;
        }
        break;
      case "form_designer":
        this.coreViewerTarget.checked = true;
        this.annotationsTarget.checked = true;
        this.formsTarget.checked = true;
        break;
      case "digital_signatures":
        this.coreViewerTarget.checked = true;
        this.annotationsTarget.checked = true;
        this.formsTarget.checked = true;
        break;
      case "full_text_search":
        this.coreViewerTarget.checked = true;
        break;
      case "document_editor":
        this.coreViewerTarget.checked = true;
        break;
      case "replies":
        this.coreViewerTarget.checked = true;
        this.annotationsTarget.checked = true;
        break;
      case "redaction":
        this.coreViewerTarget.checked = true;
        this.annotationsTarget.checked = true;
        break;
      case "comparison":
        this.coreViewerTarget.checked = true;
        break;
      case "instant":
        this.coreViewerTarget.checked = true;
        this.annotationsTarget.checked = true;
        break;
    }
  }
}
