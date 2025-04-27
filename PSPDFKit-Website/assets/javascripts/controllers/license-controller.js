import { Controller } from "stimulus";
import "jquery-deparam";
import _ from "underscore";
import { h, patch } from "superfine";

/**
 * LicenseController
 *
 * Replace placeholder license keys in code samples with real keys fetched from
 * Licensor if the url contains a license key token.
 *
 * This enables us to direct customers from Licensor to the guides and show
 * their actual license details in code samples.
 *
 * Example URL:
 * https://pspdfkit.com/guides/ios/current/getting-started/try-the-demo/#ios_token=xyz
 */
export default class extends Controller {
  static targets = ["alert"];

  connect() {
    this.token = this.parseToken();

    // Clear stored license data if token is set to `clear` so we can
    // link to guides without prefilling license data if required.
    if (this.token && this.token === "clear") {
      this.licenseData = null;
    }

    // If token in URL, fetch data, store, then render it.
    else if (this.token) {
      this.fetchLicenseData().done(res => {
        this.licenseData = res;
        this.render(this.licenseData);
      });
    }

    // If we have license data already stored, render it.
    else if (this.licenseData) {
      this.render(this.licenseData);
    }
  }

  render(data) {
    this.toggleTrialElements();

    if (Date.now() > Date.parse(data.expires_at)) {
      this.renderExpiredMessage(data);
      return;
    }

    const replacedTokens = this.replaceTokens(data);

    if (replacedTokens.length > 0) {
      this.renderReplacedMessage(data, replacedTokens);
    } else {
      this.renderActiveMessage(data);
    }
  }

  /**
   * Toggle elements that should/not be shown in the trial process.
   */
  toggleTrialElements() {
    $(".hide-in-trial").remove();
    $(".show-in-trial").show();
  }

  /**
   * Replace all instances of placeholder tokens with actual licence data.
   */
  replaceTokens(data) {
    const matches = [];
    let dirty = false;

    $(".code-content > pre, .force-replace-tokens").each((idx, el) => {
      const $el = $(el);
      const re = /YOUR_([^ ]+)_GOES_HERE/g;
      let html = $el.html();

      html.replace(re, (match, sub) => {
        matches.push({
          placeholder: match,
          key: sub.toLowerCase()
        });
      });

      matches.forEach(match => {
        if (data[match.key]) {
          if ($el.hasClass("force-replace-tokens")) {
            // Inside these elements we presume we are modifying a href
            // attribute and simply replace the token.
            html = html.replace(match.placeholder, data[match.key]);
          } else {
            // Otherwise, we wrap the token in a `<mark>` tag to highlight that
            // it has been replaced.
            html = html.replace(
              match.placeholder,
              `<mark id="${match.key}_${idx}">${data[match.key]}</mark>`
            );
          }
          dirty = true;
        }
      });

      if (dirty) {
        $el.html(html);
      }
    });

    return _.uniq(matches.map(m => m.key));
  }

  /**
   * Show a message detailing which tokens have been prefilled.
   */
  renderReplacedMessage(data, keys) {
    const url = this.trialGuideUrl;
    const title = "We've prefilled information from your trial license:";
    const props = { ...data, keys, title, url };
    const view = this.renderMessage(props);

    patch(null, view, this.alertTarget);
  }

  /**
   * Show a message indicating that licence data was detected.
   */
  renderActiveMessage(data) {
    const url = this.trialGuideUrl;
    const title = "You have an active trial license.";
    const props = { ...data, title, url };
    const view = this.renderMessage(props);

    patch(null, view, this.alertTarget);
  }

  /**
   * Show a message indicating that licence data has expired.
   */
  renderExpiredMessage(data) {
    const url = "/try/";
    const title = "Your trial license has expired.";
    const props = { ...data, title, url, expired: true };
    const view = this.renderMessage(props);

    patch(null, view, this.alertTarget);
  }

  renderMessage(props) {
    return (
      <div className="alert alert-warning">
        <button
          type="button"
          className="close"
          data-action="click->license#clear"
          data-toggle="tooltip"
          title="Clear trial license"
        >
          &times;
        </button>
        <p>
          <strong>
            {props.title}&nbsp;
            {props.expired ? (
              <a href={props.url} className="alert-link">
                Get a new trial license here.
              </a>
            ) : null}
          </strong>
        </p>
        {props.keys ? (
          <ul className="fa-ul">
            {props.keys.map(key => (
              <li data-controller="clipboard">
                <i className="fa-li fa fa-check" />
                <code>{key.toUpperCase()}</code>
                &nbsp;
                <button
                  data-action="click->clipboard#copy mouseenter->clipboard#hover"
                  className="prefilled-info-copy"
                >
                  Copy
                </button>
                <br />
                <pre
                  className="prefilled-info-value"
                  data-target="clipboard.code"
                >
                  {props[key]}
                </pre>
              </li>
            ))}
          </ul>
        ) : null}
        <div>
          <hr />
          <p className="small">
            {props.expired ? (
              <span>
                Your trial license is registered to{" "}
                <strong>{props.email}</strong> and expired on{" "}
                <strong>{props.expires_at}</strong>.
              </span>
            ) : (
              <span>
                Your trial license is registered to{" "}
                <strong>{props.email}</strong> and expires on{" "}
                <strong>{props.expires_at}</strong>.
                <br />
                <a href={props.url} className="alert-link">
                  Refer to the trial guide for help getting started.
                </a>
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  /**
   * Clear stored license data when dismissing alert message with 'X'.
   */
  clear(event) {
    event.preventDefault();
    this.licenseData = null;
    window.location.reload();
  }

  /**
   * Get the current platform (ios, android, etc.).
   */
  get platform() {
    return $("meta[name=pspdf-platform]").attr("content");
  }

  /**
   * Get the licensor api url.
   */
  get apiUrl() {
    return $("meta[name=pspdf-license-api-url]").attr("content");
  }

  /**
   * The canonical Try The Demo page url for the platform.
   */
  get trialGuideUrl() {
    const pathSegments = _.compact(window.location.pathname.split("/"));
    const prefix = pathSegments.length === 3 ? "./" : "../../";

    switch (this.platform) {
      case "web":
        return `${prefix}pspdfkit-for-web/try-the-demo/`;
      case "server":
        return `${prefix}deployment/getting-started/`;
      case "windows":
        return `${prefix}getting-started/integrating-pspdfkit/`;
      case "java":
        return `${prefix}getting-started/integrating-pspdfkit/`;
      case "dotnet":
        return `${prefix}getting-started/integrating-pspdfkit/`;
      default:
        return `${prefix}getting-started/try-the-demo/`;
    }
  }

  /**
   * Check URL for token.
   */
  parseToken() {
    const platform = this.platform;
    const params = this.hashParams;
    const key = platform + "_token";
    const token = params[key];

    if (token) {
      delete params[key];
      this.hashParams = params;
      return token;
    }
  }

  /**
   * Parse location.hash for query string style parameters.
   * `'#foo=bar&baz=qux' -> { foo: 'bar', baz: 'qux' }`
   */
  get hashParams() {
    return $.deparam(location.hash.replace("#", ""));
  }

  /**
   * Set location.hash with query string style parameters.
   * `{ foo: 'bar', baz: 'qux' } -> '#foo=bar&baz=qux'`
   */
  set hashParams(params) {
    location.hash = $.param(params);
  }

  /**
   * Fetch license data from Licensor.
   */
  fetchLicenseData() {
    return $.get(this.apiUrl + "demo_license/" + this.token);
  }

  /**
   * Get license data from localStorage.
   */
  get licenseData() {
    const data = localStorage.getItem("demo_" + this.platform + "_license");
    return JSON.parse(data);
  }

  /**
   * Save or clear license data in localStorage.
   */
  set licenseData(data) {
    if (data) {
      localStorage.setItem(
        "demo_" + this.platform + "_license",
        JSON.stringify(data)
      );
    } else {
      localStorage.removeItem("demo_" + this.platform + "_license");
    }
  }
}
