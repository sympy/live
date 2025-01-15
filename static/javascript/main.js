// JavaScript for the main SymPy Live Shell index.
$(document).ready(function () {
  console.log("Loaded custom index.html (SymPy live shell inside an iframe)");
  initializeIframeAndTheme();
});

const themeState = {
  isIframeReady: false,
  debugMode: true, // enable detailed logging
};

function debug(message, data) {
  if (!themeState.debugMode) return;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔍 ${message}`, data || "");
}

function checkIframeAccess() {
  const iframe = document.getElementById("live-iframe");
  debug("Checking iframe access:");
  debug("- iframe element exists:", !!iframe);
  debug("- iframe contentWindow exists:", !!(iframe && iframe.contentWindow));
  debug("- window.frames.jupyterlab exists:", !!window.frames.jupyterlab);

  if (iframe) {
    debug("- iframe current src:", iframe.src);
  }
}

function sendThemeMessage(theme) {
  const message = {
    type: "from-host-to-iframe",
    theme: theme,
  };

  debug("Attempting to send theme message:", message);

  try {
    // Method 1: Direct contentWindow
    const iframe = document.getElementById("live-iframe");
    if (iframe && iframe.contentWindow) {
      debug("Sending via contentWindow");
      iframe.contentWindow.postMessage(message, "*");
    }

    // Method 2: Named frame
    if (window.frames.jupyterlab) {
      debug("Sending via named frame");
      window.frames.jupyterlab.postMessage(message, "*");
    }
  } catch (e) {
    debug("Error sending message:", e);
  }
}

function setTheme(mode) {
  debug(`Setting theme mode: ${mode}`);
  localStorage.setItem("theme-mode", mode);

  let actualTheme;
  if (mode === "auto") {
    actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } else {
    actualTheme = mode;
  }

  document.documentElement.setAttribute("data-theme", actualTheme);

  const themeEmoji = document.querySelector(".theme-emoji");
  if (themeEmoji) {
    themeEmoji.textContent = {
      light: "☀️",
      dark: "🌙",
      auto: "🌗",
    }[mode];
  }

  if (themeState.isIframeReady) {
    const jupyterTheme =
      actualTheme === "dark" ? "JupyterLab Dark" : "JupyterLab Light";
    debug(`Preparing to send theme: ${jupyterTheme}`);
    checkIframeAccess(); // Check iframe accessibility
    sendThemeMessage(jupyterTheme);
  } else {
    debug("Iframe not ready, skipping theme sync");
  }
}

function cycleTheme() {
  debug("Theme toggle clicked");
  const currentMode = localStorage.getItem("theme-mode") || "light";
  const modes = ["light", "dark", "auto"];
  const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
  setTheme(nextMode);
}

function initializeIframeAndTheme() {
  debug("Starting initialization");

  // Listen for messages from iframe
  window.addEventListener("message", (event) => {
    debug("Received message from iframe:", event.data);
    if (event.data.type === "from-iframe-to-host") {
      debug("Theme confirmation from iframe:", event.data.theme);
    }
  });

  // Wait for iframe to be ready
  const liveIframe = document.getElementById("live-iframe");
  if (liveIframe) {
    debug("Found iframe element, setting up load listener");

    liveIframe.addEventListener("load", () => {
      debug("Iframe loaded, current src:", liveIframe.src);

      // Check if src contains expected JupyterLite path
      if (!liveIframe.src.includes("repl")) {
        debug("Warning: Iframe src might not be correct JupyterLite instance");
      }

      setTimeout(() => {
        themeState.isIframeReady = true;
        debug("JupyterLite initialization timeout complete");
        checkIframeAccess();

        const savedMode = localStorage.getItem("theme-mode") || "light";
        setTheme(savedMode);
      }, 2000);
    });
  } else {
    debug("Warning: Could not find iframe element");
  }

  // Set up theme toggle
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", cycleTheme);
    debug("Theme toggle button initialized");
  }

  // Set up system theme detection
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (localStorage.getItem("theme-mode") === "auto") {
      setTheme("auto");
    }
  });

  // Initial theme
  const savedMode = localStorage.getItem("theme-mode") || "light";
  debug("Setting initial theme:", savedMode);
  setTheme(savedMode);
}
