/* eslint-env browser */

// Get theme data from local storage
let currentTheme = localStorage.getItem("theme");
let userHasManuallySetTheme = localStorage.getItem("themeSetManually") === "true";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getPreferredTheme() {
  // If user manually set a theme, use it
  if (userHasManuallySetTheme && currentTheme) {
    return currentTheme;
  }
  
  // Otherwise, follow system preference
  return getSystemTheme();
}

let themeValue = getPreferredTheme();

function setPreference(isManualChange = false) {
  if (isManualChange) {
    // User clicked the toggle button
    localStorage.setItem("theme", themeValue);
    localStorage.setItem("themeSetManually", "true");
    userHasManuallySetTheme = true;
  } else if (!userHasManuallySetTheme) {
    // System changed and user hasn't manually set theme
    // Don't save to localStorage, just update the display
  }
  reflectPreference();
}

function reflectPreference() {
  document.documentElement.setAttribute("data-theme", themeValue);

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using it
  if (body) {
    // Set the `color-scheme` CSS property to the current theme
    body.style.colorScheme = themeValue;
  }
}

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  function setThemeFeature() {
    // set on load so screen readers can get the latest value on the button
    reflectPreference();

    // now this script can find and listen for clicks on the control
    document.querySelector("#theme-btn")?.addEventListener("click", () => {
      themeValue = themeValue === "light" ? "dark" : "light";
      setPreference(true); // true = manual change
    });
  }

  setThemeFeature();

  // Runs on view transitions navigation
  document.addEventListener("astro:after-swap", setThemeFeature);
};

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    const newSystemTheme = isDark ? "dark" : "light";
    
    // If user hasn't manually set theme, follow system
    if (!userHasManuallySetTheme) {
      themeValue = newSystemTheme;
      setPreference(false); // false = system change
    } else if (currentTheme === getSystemTheme()) {
      // If user's manual choice now matches system, clear the manual flag
      // This allows the theme to follow system again
      localStorage.removeItem("themeSetManually");
      userHasManuallySetTheme = false;
      themeValue = newSystemTheme;
      setPreference(false);
    }
  });
