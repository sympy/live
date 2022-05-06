# JupyterLite Shell for Sympy Live 

This repo contains the [JupyterLite](https://jupyterlite.readthedocs.io) config
files used by the new SymPy Live. The code is deployed as a static site to GitHub Pages.



## ✨ Try it in your browser ✨

- **https://sympy.github.io/live/repl/index.html?toolbar=1&kernel=python**


## Requirements

JupyterLite is being tested against modern web browsers:

- Firefox 90+
- Chromium 89+



## Commands

See Developer instructions below for installing the prerequisites.

Run jupyter lite locally:
```bash
jupyter lite serve
```

Build ready for distribution via static serve:

```bash
jupyter lite build
```

The files will be saved in `_output/`.


You can test the files using any static server, for example:

```bash
cd _output/
python -m http.server
```


## Configs

The operation of JupyterLite can be configured in several places:
- `jupyter_lite_config.json`: general configs for the jupyter lite build system
- `repl/jupyter-lite.json`: configs specific to the REPL app. See [example here](https://github.com/ivanistheone/live/blob/357e60a228b43ac28ef835953d00f4495a429d78/repl/jupyter-lite.json).
- `overrides.json`: customizations of the JupyterLite UI
- `requirements.txt`: Python packages needed to build this project (used by CI)


### Further Information and Updates

For more info, keep an eye on the JupyterLite documentation:

- Configuring: https://jupyterlite.readthedocs.io/en/latest/configuring.html
- Deploying: https://jupyterlite.readthedocs.io/en/latest/deploying.html


## Deploy a new version of JupyterLite

To change the version of the prebuilt JupyterLite assets, update the `jupyterlite`
package version in the [requirements.txt](./blob/main/requirements.txt) file.

The `requirements.txt` file can also be used to add extra prebuilt ("federated")
JupyterLab extensions to the deployed JupyterLite website.

Commit and push any changes. The site will be deployed on the next push to the `main` branch.


## Development

1. Create a new conda environment using virualenv or conda.
2. Install Python requirements:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. You can now run `jupyter lite` commands like `check`, `build`, `serve`, etc.
