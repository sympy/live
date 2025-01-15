// JavaScript for the main SymPy Live Shell index.
$(document).ready(function () {
  console.log("Loaded custom index.html (SymPy live shell inside an iframe)");
  initializeIframeAndTheme();
});

const themeState = {
  isIframeReady: false,
  debugMode: true,
  currentKernelTheme: null // Track kernel theme state
};

function debug(message, data) {
  if (!themeState.debugMode) return;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔍 ${message}`, data || '');
}

function getEffectiveTheme(mode) {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function updateUI(mode, effectiveTheme) {
  document.documentElement.setAttribute("data-theme", effectiveTheme);
  
  const themeEmoji = document.querySelector(".theme-emoji");
  const themeText = document.querySelector(".theme-text");
  if (themeEmoji && themeText) {
    themeEmoji.textContent = {
      light: "☀️",
      dark: "🌙",
      auto: "🌗",
    }[mode];
    themeText.textContent = {
      light: "Light",
      dark: "Dark",
      auto: "Auto",
    }[mode];
  }
}

function shouldUpdateKernelTheme(mode, effectiveTheme) {
  // For light/dark modes, always enforce the mode
  if (mode === "light" || mode === "dark") {
    const desiredKernelTheme = mode === "dark" ? "JupyterLab Dark" : "JupyterLab Light";
    return themeState.currentKernelTheme !== desiredKernelTheme;
  }

  // For auto mode, only change if kernel theme doesn't match content theme
  if (mode === "auto") {
    const desiredKernelTheme = effectiveTheme === "dark" ? "JupyterLab Dark" : "JupyterLab Light";
    return themeState.currentKernelTheme !== desiredKernelTheme;
  }

  return false;
}

function sendThemeToIframe(theme) {
  if (!themeState.isIframeReady) return;

  const jupyterTheme = theme === "dark" ? "JupyterLab Dark" : "JupyterLab Light";
  
  // Only send if we need to change
  if (jupyterTheme !== themeState.currentKernelTheme) {
    debug(`Sending theme to iframe: ${jupyterTheme} (current: ${themeState.currentKernelTheme})`);
    
    try {
      const message = {
        type: "from-host-to-iframe",
        theme: jupyterTheme
      };

      const iframe = document.getElementById("live-iframe");
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(message, "*");
      }
      if (window.frames.jupyterlab) {
        window.frames.jupyterlab.postMessage(message, "*");
      }
      
      themeState.currentKernelTheme = jupyterTheme;
    } catch (e) {
      debug("Error sending theme message:", e);
    }
  } else {
    debug(`Skipping kernel theme update - already ${jupyterTheme}`);
  }
}

function setTheme(mode, isInitial = false) {
  debug(`Setting theme mode: ${mode} (initial: ${isInitial})`);
  localStorage.setItem("theme-mode", mode);

  const effectiveTheme = getEffectiveTheme(mode);
  debug(`Effective theme: ${effectiveTheme}`);

  // Update UI
  updateUI(mode, effectiveTheme);

  // Selectively update kernel theme
  if (shouldUpdateKernelTheme(mode, effectiveTheme)) {
    sendThemeToIframe(effectiveTheme);
  } else {
    debug("Keeping current kernel theme");
  }
}

function cycleTheme() {
  const currentMode = localStorage.getItem("theme-mode") || "light";
  const modes = ["light", "dark", "auto"];
  const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
  setTheme(nextMode);
}

function initializeIframeAndTheme() {
  debug("Starting initialization");

  // Listen for theme confirmations from iframe
  window.addEventListener("message", (event) => {
    if (event.data.type === "from-iframe-to-host") {
      debug("Theme confirmation from iframe:", event.data.theme);
      themeState.currentKernelTheme = event.data.theme;
    }
  });

  const liveIframe = document.getElementById("live-iframe");
  if (liveIframe) {
    liveIframe.addEventListener("load", () => {
      debug("Iframe loaded");
      setTimeout(() => {
        themeState.isIframeReady = true;
        debug("JupyterLite initialization complete");
        const savedMode = localStorage.getItem("theme-mode") || "light";
        setTheme(savedMode, true);
      }, 2000);
    });
  }

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", cycleTheme);
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    const currentMode = localStorage.getItem("theme-mode") || "light";
    if (currentMode === "auto") {
      setTheme("auto");
    }
  });

  const savedMode = localStorage.getItem("theme-mode") || "light";
  setTheme(savedMode, true);
}
