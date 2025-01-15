// JavaScript for the main SymPy Live Shell index.
$(document).ready(function () {
  console.log("Loaded custom index.html (SymPy live shell inside an iframe)");
  initTheme();
});

// Theme management
function setTheme(mode) {
  // Handle auto mode
  if (mode === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  } else {
    document.documentElement.setAttribute("data-theme", mode);
  }

  localStorage.setItem("theme-mode", mode);

  // Update theme emoji
  const themeEmoji = document.querySelector(".theme-emoji");
  if (themeEmoji) {
    themeEmoji.textContent = {
      light: "☀️",
      dark: "🌙",
      auto: "🌗",
    }[mode];
  }

  // Update JupyterLite iframe
  const liveIframe = document.getElementById("live-iframe");
  if (liveIframe) {
    const currentSrc = new URL(liveIframe.src);
    const baseUrl = currentSrc.origin + currentSrc.pathname;
    const params = new URLSearchParams(currentSrc.search);

    // Update theme parameter based on actual theme (not mode)
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      params.set("theme", "JupyterLab Dark");
    } else {
      params.delete("theme");
    }

    // Reconstruct iframe URL with updated parameters
    liveIframe.src = `${baseUrl}?${params.toString()}`;
  }
}

function cycleTheme() {
  const currentMode = localStorage.getItem("theme-mode") || "light";
  const modes = ["light", "dark", "auto"];
  const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
  setTheme(nextMode);
}

// Initialize theme
function initTheme() {
  // Set initial theme
  const savedMode = localStorage.getItem("theme-mode") || "light";
  setTheme(savedMode);

  // Add theme toggle listener
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", cycleTheme);
  }

  // Add system theme detection for auto mode
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (localStorage.getItem("theme-mode") === "auto") {
      setTheme("auto");
    }
  });
}
