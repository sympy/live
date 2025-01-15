// JavaScript for the main SymPy Live Shell index.
$(document).ready(function() {
    console.log("Loaded custom index.html (SymPy live shell inside an iframe)");
    initThemeSystem();
});

// Theme state management
const themeState = {
    mode: localStorage.getItem("theme-mode") || "light",
    isIframeReady: false
};

// Debug logging
function debug(message, data = null) {
    const timestamp = new Date().toISOString();
    if (data) {
        console.log(`[${timestamp}] 🔍 ${message}`, data);
    } else {
        console.log(`[${timestamp}] 🔍 ${message}`);
    }
}

// Initialize theme system
function initThemeSystem() {
    debug("Initializing theme system");
    
    // Set up theme toggle button listener
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", handleThemeToggle);
        debug("Theme toggle button listener added");
    }

    // Listen for messages from JupyterLite iframe
    window.addEventListener('message', handleIframeMessage);
    debug("Message listener added");

    // Set up iframe load listener
    const liveIframe = document.getElementById("live-iframe");
    if (liveIframe) {
        liveIframe.addEventListener('load', function() {
            debug("Iframe loaded, waiting for JupyterLite initialization");
            // Wait for JupyterLite to fully initialize
            setTimeout(() => {
                themeState.isIframeReady = true;
                debug("JupyterLite initialization timeout complete");
                syncThemeToIframe(getCurrentTheme());
            }, 2000);
        });
    }

    // Apply initial theme
    setTheme(themeState.mode);

    // Add system theme detection for auto mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", () => {
        if (themeState.mode === "auto") {
            debug("System theme changed, updating auto mode");
            setTheme("auto");
        }
    });
}

// Handle iframe messages
function handleIframeMessage(event) {
    debug("Received message from iframe", event.data);
    
    // Match the exact message type from the JupyterLite example
    if (event.data.type === 'from-iframe-to-host') {
        debug('Theme change confirmation from JupyterLite:', event.data.theme);
    }
}

// Get current effective theme (resolves auto mode)
function getCurrentTheme() {
    if (themeState.mode === "auto") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return themeState.mode;
}

// Handle theme toggle button click
function handleThemeToggle() {
    debug("Theme toggle clicked");
    const modes = ["light", "dark", "auto"];
    const currentIndex = modes.indexOf(themeState.mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setTheme(nextMode);
}

// Set theme in both parent and iframe
function setTheme(mode) {
    debug(`Setting theme mode to: ${mode}`);
    
    // Update state
    themeState.mode = mode;
    localStorage.setItem("theme-mode", mode);

    // Get actual theme (dark/light)
    const actualTheme = getCurrentTheme();
    debug(`Actual theme resolved to: ${actualTheme}`);

    // Update parent document theme
    document.documentElement.setAttribute("data-theme", actualTheme);

    // Update emoji
    updateThemeEmoji(mode);

    // Sync theme to iframe if ready
    if (themeState.isIframeReady) {
        syncThemeToIframe(actualTheme);
    } else {
        debug("Iframe not ready yet, skipping theme sync");
    }
}

// Update theme toggle button emoji
function updateThemeEmoji(mode) {
    const themeEmoji = document.querySelector(".theme-emoji");
    if (themeEmoji) {
        themeEmoji.textContent = {
            light: "☀️",
            dark: "🌙",
            auto: "🌗"
        }[mode];
        debug(`Updated theme emoji for mode: ${mode}`);
    }
}

// Sync theme to JupyterLite iframe using postMessage
function syncThemeToIframe(theme) {
    const liveIframe = document.getElementById("live-iframe");
    if (liveIframe && liveIframe.contentWindow) {
        // Match the exact message type from the JupyterLite example
        const message = {
            type: 'from-host-to-iframe',
            theme: theme === 'dark' ? 'JupyterLab Dark' : 'JupyterLab Light'
        };
        
        debug('Sending message to JupyterLite:', message);
        liveIframe.contentWindow.postMessage(message, '*');
        
        // Try sending another format just in case
        const altMessage = {
            type: 'jupyter-theme-change',
            theme: theme === 'dark' ? 'JupyterLab Dark' : 'JupyterLab Light'
        };
        debug('Sending alternative message format:', altMessage);
        liveIframe.contentWindow.postMessage(altMessage, '*');
    } else {
        debug('Unable to send message - iframe or contentWindow not available');
    }
}
