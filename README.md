# JupyterLite Shell for SymPy Live 

This repo contains the code that powers the [SymPy Live Shell](https://live.sympy.org/),
which is based on the [JupyterLite](https://jupyterlite.readthedocs.io) application,
and deployed as a static site to GitHub Pages.


## ✨ Try it in your browser ✨

- **https://live.sympy.org/**

Other interesting URLs:
- https://www.sympy.org/en/shell.html
- [evaluate command](https://www.sympy.org/en/shell.html?evaluate=diff(sin(x)%2C%20x)%0A%23--%0A)



## Developer information

The SymPy Live shell is a thin wrapper around the `repl` app in the JupyterLite.
In order to reduce the maintentance needs,
we leverages the code from the [`jupyterlite/demo`](https://github.com/jupyterlite/demo) project,
and provides only minimal customization: a custom landing page that loads the repl in an iframe.


### Configs

The operation of JupyterLite is configured in several places:
- `requirements.txt`: specifies the version `jupyterlab`, `jupyterlite-core` and `jupyterlite-pyodide-kernel`.
- `jupyter_lite_config.json`: general configs for the jupyter lite build system
- `repl/jupyter-lite.json`: configs specific to the REPL app. See [example here](https://github.com/ivanistheone/live/blob/357e60a228b43ac28ef835953d00f4495a429d78/repl/jupyter-lite.json).
- `overrides.json`: customizations of the JupyterLite UI

In addition to the above, the SymPy Live shell depends on the following customizations:
- Custom landing page [index.html](https://github.com/sympy/live/blob/main/templates/index.html) that embeds the JupyterLite REPL.
- Automatic import `from sympy import *` and init commands in [index.html template](https://github.com/sympy/live/blob/main/templates/index.html#L6-L11).
- JavaScript code to decode evaluate query string, see [here](https://github.com/sympy/live/blob/main/templates/index.html#L49-L56).

> [!NOTE]
> Updating the version of SymPy running on [live.sympy.org/](https://live.sympy.org/) usually requires updating the version of `jupyterlab`, `jupyterlite-core`, and `jupyterlite-pyodide-kernel` listed in `requirements.txt`. Use the [upstream requirements file](https://github.com/jupyterlite/demo/blob/main/requirements.txt) as reference. See [here](https://pyodide.org/en/stable/usage/packages-in-pyodide.html) for the backage verison included in Pyodide. 



### Deploying in production

SymPy Live Shell is hosted as a static website on GitHub Pages with a custom domain.
Deployment to production is automated by the Github actions workflow [deploy.yml](https://github.com/sympy/live/blob/main/.github/workflows/deploy.yml),
which performs the following steps:

 1. Installs Python and dependencies listed in `requirements.txt`
 2. Runs the command `jupyter lite build` to build the JupyterLab static site, placing the results in `_output/`.
 3. Runs `./generateindex.py` to overweite the index file `_output/index.html` with the custom SymPy Live Shell landing page.
 4. Adds the file `_output/CNAME` containing `live.sympy.org`.
 5. Deploys the contents of `_output` to GitHub pages (`gh-pages` branch hosted at https://live.sympy.org).

The last step (deploy to `gh-pages`) runs only on push to the `main` branch.


### Running locally

The Local development steps are similar to the prodction step,
but you'll run local web server to view the static files in `_output`,
and modify one line in `templates/index.html` to load the iframe from localhost (127.0.0.1):

 1. Install Python and dependencies listed in `requirements.txt`
 2. Runs the command `jupyter lite build` to build the JupyterLab static site, placing the results in `_output/`.
 3. Edit [`templates/index.html`](https://github.com/sympy/live/blob/main/templates/index.html#L3)
    to change the value of `host` from `https://www.sympy.org/live` to `http://127.0.0.1:8000`.
 4. Run `./generateindex.py` to overweite the index file `_output/index.html` with the custom SymPy Live Shell landing page.
 5. Run a local web server in the directory `_output/`. For example, you can run `cd _output/` followed by `python3 -m http.server 8000`.
 6. Open `http://127.0.0.1:8000/index.html` in your browser.



### More information

For more info, keep an eye on the JupyterLite documentation:

- Configuring: https://jupyterlite.readthedocs.io/en/stable/quickstart/configure.html
- Deploying to GitHub pages: https://jupyterlite.readthedocs.io/en/stable/quickstart/deploy.html

