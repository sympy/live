// JavaScript for the main SymPy Live Shell index.
$(document).ready(function () {
  console.log("Loaded custom index.html (SymPy live shell inside an iframe)");
  initializeTheme();
});

let commandBridge = null;
let bridgeReady = false;
let bridgeInitializing = false;

function initializeTheme() {
  console.log("Initializing theme...");

  const mode = getThemeMode();
  const effective = computeEffectiveTheme(mode);
  updateHostTheme(mode, effective);

  setupThemeToggle();
  setupMediaQueryListener();

  setupIframeCommunication();
}

function getThemeMode() {
  return localStorage.getItem("theme-mode") || "light";
}

function setThemeMode(mode) {
  localStorage.setItem("theme-mode", mode);
}

function computeEffectiveTheme(mode) {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
}

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

// Theme toggle functionality
function setupThemeToggle() {
  const toggleButton = document.querySelector(".theme-toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", handleThemeToggle);
  }
}

function handleThemeToggle() {
  const modes = ["light", "dark", "auto"];
  const currentMode = getThemeMode();
  const currentIndex = modes.indexOf(currentMode);
  const nextMode = modes[(currentIndex + 1) % modes.length];

  console.log("Theme toggle clicked:", currentMode, "→", nextMode);

  setThemeMode(nextMode);
  const effective = computeEffectiveTheme(nextMode);
  updateHostTheme(nextMode, effective);

  updateIframeTheme(effective);
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
    console.log("Media query changed, auto theme updated to:", effective);
  }
}

function setupIframeCommunication() {
  const iframe = document.getElementById("live-iframe");
  if (iframe) {
    iframe.addEventListener("load", function () {
      console.log("Iframe loaded, attempting bridge initialization...");
      setTimeout(initializeBridge, 3000);
    });
  }
}

async function initializeBridge() {
  if (bridgeReady || bridgeInitializing) {
    console.log("Bridge already ready or initializing");
    return commandBridge;
  }

  bridgeInitializing = true;

  try {
    console.log("Loading bridge module...");
    const { createBridge } = await import(
      "https://esm.run/jupyter-iframe-commands-host@latest"
    );

    console.log("Creating bridge...");
    commandBridge = createBridge({ iframeId: "live-iframe" });

    console.log("Testing bridge connection...");

    try {
      const commands = await commandBridge.listCommands();
      console.log("Bridge connected. Available commands:", commands.length);

      const themeCommand = commands.find(
        (cmd) => cmd.id === "apputils:change-theme"
      );
      console.log("Theme command available:", !!themeCommand);

      bridgeReady = true;
      bridgeInitializing = false;

      const mode = getThemeMode();
      const effective = computeEffectiveTheme(mode);
      await updateIframeTheme(effective);

      return commandBridge;
    } catch (commandError) {
      console.log("Bridge not ready, waiting 2 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const commands = await commandBridge.listCommands();
      console.log(
        "Bridge connected after retry. Available commands:",
        commands.length
      );

      const themeCommand = commands.find(
        (cmd) => cmd.id === "apputils:change-theme"
      );
      console.log("Theme command available:", !!themeCommand);

      bridgeReady = true;
      bridgeInitializing = false;

      const mode = getThemeMode();
      const effective = computeEffectiveTheme(mode);
      await updateIframeTheme(effective);

      return commandBridge;
    }
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
    console.log("Bridge not ready, attempting to initialize...");
    await initializeBridge();
  }

  if (!bridgeReady || !commandBridge) {
    console.log("Bridge not ready, cannot update iframe theme");
    return;
  }

  const themeName =
    effective === "dark" ? "JupyterLab Dark" : "JupyterLab Light";

  try {
    console.log("Applying theme to iframe:", themeName);
    await commandBridge.execute("apputils:change-theme", { theme: themeName });
    console.log("Iframe theme applied successfully:", themeName);
  } catch (error) {
    console.error("Failed to apply theme to iframe:", error);
  }
}
