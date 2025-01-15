// This file was generated automatically by Copier and the template at
// https://github.com/jupyterlab/extension-template

// Sourced from: https://jupyterlite.readthedocs.io/en/stable/howto/configure/advanced/iframe.html#extension-development

// Subsequently modified by Agriya Khetarpal to respect "Auto mode"
// and to send the theme to the host only when it changes.

// License: BSD-3-Clause

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the sympy-live-repl-theme-bridge extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'sympy-live-repl-theme-bridge:plugin',
  description:
    'A basic JupyterLab/JupyterLite extension to create a theme bridge for the SymPy Live Shell hosted at https://live.sympy.org',
  autoStart: true,
  requires: [IThemeManager],
  activate: (app: JupyterFrontEnd, themeManager: IThemeManager) => {
    console.log(
      'JupyterLab extension sympy-live-repl-theme-bridge is activated!'
    );

    /* Incoming messages management */
    window.addEventListener('message', event => {
      if (event.data.type === 'from-host-to-iframe') {
        console.log('Message received in the iframe:', event.data);
        // Only change theme if specified theme is different
        const requestedTheme = event.data.theme;
        if (requestedTheme && requestedTheme !== themeManager.theme) {
          themeManager.setTheme(requestedTheme);
        }
      }
    });

    /* Outgoing messages management */
    const notifyThemeChanged = (): void => {
      const message = {
        type: 'from-iframe-to-host',
        theme: themeManager.theme
      };
      window.parent.postMessage(message, '*');
      console.log('Message sent to the host:', message);
    };
    themeManager.themeChanged.connect(notifyThemeChanged);
  }
};

export default plugin;
