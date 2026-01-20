// JavaScript for the main SymPy Live Shell index.
$(document).ready(function () {
  initializeTheme();
});

let commandBridge = null;
let bridgeReady = false;
let bridgeInitializing = false;

function initializeTheme() {
  const mode = getThemeMode();
  const effectiveMode = computeEffectiveTheme(mode);
  updateHostTheme(mode, effectiveMode);

  setupThemeToggle();
  setupMediaQueryListener();

  setupIframeCommunication();
}

/**
 * Get the current theme mode from local storage.
 * @returns {string} The current theme mode ("light", "dark", or "auto").
 */
function getThemeMode() {
  return localStorage.getItem("theme-mode") || "light";
}

/**
 * Set the current theme mode in local storage.
 * @param {string} mode - The theme mode to set ("light", "dark", or "auto").
 */
function setThemeMode(mode) {
  localStorage.setItem("theme-mode", mode);
}

/**
 * Compute the effective theme based on the current mode and user preferences.
 * @param {string} mode - The current theme mode ("light", "dark", or "auto").
 * @returns {string} The effective theme ("light" or "dark").
 */
function computeEffectiveTheme(mode) {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
}

/**
 * Update the host theme based on the current mode and effective theme.
 * We update the FA icon displayed to indicate the current theme.
 * @param {string} mode - The current theme mode ("light", "dark", or "auto").
 * @param {string} effective - The effective theme ("light" or "dark").
 */
function updateHostTheme(mode, effective) {
  document.documentElement.setAttribute("data-theme", effective);

  const icon = document.querySelector(".theme-toggle .fa-solid");
  if (icon) {
    icon.classList.remove("fa-sun", "fa-moon", "fa-circle-half-stroke");
    if (mode === "auto") {
      icon.classList.add("fa-circle-half-stroke");
    } else if (effective === "dark") {
      icon.classList.add("fa-moon");
    } else {
      icon.classList.add("fa-sun");
    }
  }

  console.log("Host theme updated:", { mode, effective });
}

/**
 * Setup the theme toggle button.
 */
function setupThemeToggle() {
  const toggleButton = document.querySelector(".theme-toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", handleThemeToggle);
  }
}

/**
 * Handle theme toggle button click.
 */
function handleThemeToggle() {
  const modes = ["light", "dark", "auto"];
  const currentMode = getThemeMode();
  const currentIndex = modes.indexOf(currentMode);
  const nextMode = modes[(currentIndex + 1) % modes.length];

  setThemeMode(nextMode);
  const effective = computeEffectiveTheme(nextMode);

  async function updateIframeThenHostTheme() {
    
    await updateIframeTheme(effective);
    updateHostTheme(nextMode, effective);
  }

  updateIframeThenHostTheme();
  
}

// Media query listener, for auto mode (when we use the user's settings
// to determine their intent)
function setupMediaQueryListener() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", handleMediaQueryChange);
}

function handleMediaQueryChange() {
  const mode = getThemeMode();
  if (mode === "auto") {
    const effective = computeEffectiveTheme("auto");
    updateHostTheme("auto", effective);
    updateIframeTheme(effective);
  }
}

function setupIframeCommunication() {
  const iframe = document.getElementById("live-iframe");
  if (iframe) {
    iframe.addEventListener("load", function () {
      setTimeout(initializeBridge, 3000);
    });
  }
}

async function initializeBridge() {
  if (bridgeReady || bridgeInitializing) {
    return commandBridge;
  }

  bridgeInitializing = true;

  try {
    const { createBridge } = await import(
      "https://esm.run/jupyter-iframe-commands-host@0.3"
    );

    commandBridge = createBridge({ iframeId: "live-iframe" });
    await commandBridge.ready;

    bridgeReady = true;
    bridgeInitializing = false;

    return commandBridge;
  } catch (error) {
    console.error("Bridge initialization failed:", error);
    commandBridge = null;
    bridgeReady = false;
    bridgeInitializing = false;
    return null;
  }
}

async function updateIframeTheme(effective) {
  if (!bridgeReady && !bridgeInitializing) {
    await initializeBridge();
  }

  if (!bridgeReady || !commandBridge) {
    return;
  }

  const themeName =
    effective === "dark" ? "JupyterLab Dark" : "JupyterLab Light";

  try {
    await commandBridge.execute("apputils:change-theme", { theme: themeName });
    console.log("Iframe theme applied successfully:", themeName);
  } catch (error) {
    console.error("Failed to apply theme to iframe:", error);
  }
}