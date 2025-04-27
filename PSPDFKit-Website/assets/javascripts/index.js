import "jquery";
import "jquery-inview";
import "popper.js";
import "bootstrap";
import "zoom";
import "lazysizes";

import "./anchors";
import "./animation";
import "./external-links";
import "./platform-checkbox";
import "./tooltips";
import "./video-player";
import "./web-loader";
import "./cookie-consent";

import "@stimulus/polyfills";
import { Application } from "stimulus";
import { definitionsFromContext } from "stimulus/webpack-helpers";

const application = Application.start();
const context = require.context("./controllers", true, /\.js$/);
application.load(definitionsFromContext(context));
