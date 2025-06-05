/* eslint-env browser */

// Theme modes: "auto" | "light" | "dark"
let themeMode = localStorage.getItem("themeMode") || "auto";
let currentActualTheme = "light"; // The actual theme being displayed

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getActualTheme() {
  if (themeMode === "auto") {
    return getSystemTheme();
  }
  return themeMode;
}

// Get the initial actual theme
currentActualTheme = getActualTheme();

function setPreference() {
  // Save the mode (auto, light, or dark)
  if (themeMode === "auto") {
    localStorage.removeItem("themeMode");
  } else {
    localStorage.setItem("themeMode", themeMode);
  }
  
  // Update the actual theme
  currentActualTheme = getActualTheme();
  reflectPreference();
}

function updateThemeButton() {
  const btn = document.querySelector("#theme-btn");
  if (!btn) return;
  
  // Update aria-label to show current mode
  btn.setAttribute("aria-label", `Theme: ${themeMode} (${currentActualTheme})`);
  
  // Add data attribute for CSS styling
  btn.setAttribute("data-theme-mode", themeMode);
  
  // Update title for better UX
  const nextMode = themeMode === "auto" ? "light" : themeMode === "light" ? "dark" : "auto";
  btn.setAttribute("title", `Switch to ${nextMode} mode`);
}

function reflectPreference() {
  // Apply the actual theme
  document.documentElement.setAttribute("data-theme", currentActualTheme);

  // Update body color scheme
  const body = document.body;
  if (body) {
    body.style.colorScheme = currentActualTheme;
  }
  
  // Update button state
  updateThemeButton();
}

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  function setThemeFeature() {
    // set on load so screen readers can get the latest value on the button
    reflectPreference();

    // now this script can find and listen for clicks on the control
    document.querySelector("#theme-btn")?.addEventListener("click", () => {
      // Cycle through: auto -> light -> dark -> auto
      if (themeMode === "auto") {
        themeMode = "light";
      } else if (themeMode === "light") {
        themeMode = "dark";
      } else {
        themeMode = "auto";
      }
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
  .addEventListener("change", () => {
    // Only update if in auto mode
    if (themeMode === "auto") {
      currentActualTheme = getActualTheme();
      reflectPreference();
    }
  });
