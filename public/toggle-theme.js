/* eslint-env browser */
const primaryColorScheme = "light"; // Default theme: "light" | "dark"

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");

function getPreferredTheme() {
  // return theme value in localStorage if it's set
  if (currentTheme) return currentTheme;

  // return primary color scheme if it's set
  if (primaryColorScheme) return primaryColorScheme;

  // return user device's preferred color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferredTheme();

function setPreference() {
  localStorage.setItem("theme", themeValue);
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
      setPreference();
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
    themeValue = isDark ? "dark" : "light";
    setPreference();
  });
