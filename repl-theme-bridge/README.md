# sympy-live-repl-theme-bridge

A basic JupyterLab/JupyterLite extension to create a theme bridge for the SymPy Live Shell
hosted at https://live.sympy.org. It provides the machinery to change the theme for the
JupyterLite REPL in sync with the contents of the page, without having to restart the
kernel again.

This extension is based on the [JupyterLab Theme Bridge](https://jupyterlite.readthedocs.io/en/stable/howto/configure/advanced/iframe.html#extension-development) and modifies the theme of the SymPy Live Shell
to match the theme of the JupyterLab/JupyterLite environment.

The bridging logic is present in the `src/index.ts` file, and is complemented by the
theme toggle in the [`main.js`](../static/main.js) file.

## Requirements

- JupyterLab >= 4.0.0

## Install

The extension has not been published to the Python Package Index (PyPI) yet.

To install it, execute:

```bash
pip install .
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall sympy-live-repl-theme-bridge
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the sympy_live_repl_theme_bridge directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall sympy-live-repl-theme-bridge
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `sympy-live-repl-theme-bridge` within that folder.
