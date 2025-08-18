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
In order to reduce the maintenance needs,
we leverage the code from the [`jupyterlite/demo`](https://github.com/jupyterlite/demo) project,
and provide only minimal customization: a custom landing page that loads the REPL in an iframe.


### Configs

The operation of JupyterLite is configured in several places:
- `requirements.txt`: specifies the version `jupyterlab`, `jupyterlite-core` and `jupyterlite-pyodide-kernel`.
- `jupyter_lite_config.json`: general configs for the JupyterLite build system and custom wheels to make available to the Pyodide kernel for installation.
- `repl/jupyter-lite.json`: configs specific to the REPL app. See [example here](https://github.com/ivanistheone/live/blob/357e60a228b43ac28ef835953d00f4495a429d78/repl/jupyter-lite.json).
- `overrides.json`: customizations of the JupyterLite UI

In addition to the above, the SymPy Live shell depends on the following customizations:
- Custom landing page [index.html](https://github.com/sympy/live/blob/main/templates/index.html) that embeds the JupyterLite REPL.
- Automatic install (`%pip install sympy`), import (`from sympy import *`) and init commands in [index.html template](https://github.com/sympy/live/blob/main/templates/index.html#L6-L11).
- JavaScript code to decode evaluate query string, see [here](https://github.com/sympy/live/blob/main/templates/index.html#L49-L56).

> [!NOTE]
> The versions of `jupyterlab` and `jupyterlite-core` determine which version of JupyterLite we are running.
> Use the [upstream requirements file](https://github.com/jupyterlite/demo/blob/main/requirements.txt) as reference.

> [!NOTE]
> Pyodide might not have the latest version of SymPy available in PyPI. The [version of SymPy available in Pyodide](https://github.com/pyodide/pyodide/tree/main/packages/sympy) is updated only when a new version of Pyodide is released. This can take a considerable amount of time, which means that it can get outdated.
> Therefore, we ensure that the version of SymPy used in the SymPy Live Shell is up-to-date by running the `pip download sympy --no-deps` command before deployment, which downloads the latest version of SymPy from PyPI and stores it in `custom_wheels/`. This directory is indexed by JupyterLite via the `jupyter_lite_config.json` file to make the wheel available to the Pyodide kernel for the REPL app for installation.
> It is still recommended to keep updating the SymPy version in Pyodide to the latest version to ensure that the SymPy Live Shell is always up-to-date, so that we don't have to run the `pip download` command before every deployment.


### Deploying in production

SymPy Live Shell is hosted as a static website on GitHub Pages with a custom domain.
Deployment to production is automated by the Github actions workflow [deploy.yml](https://github.com/sympy/live/blob/main/.github/workflows/deploy.yml),
which performs the following steps:

1. Installs Python and dependencies listed in `requirements.txt`
2. Runs the `pip download sympy --no-deps --dest custom_wheels` command and stores the wheel in `custom_wheels/`. This directory is indexed by JupyterLite via the [`jupyter_lite_config.json`](jupyter_lite_config.json) file to make the wheel available to the Pyodide kernel for the REPL app.
3. Runs `unvendor_tests_from_wheel.py custom_wheels` to remove the tests from the downloaded wheel, reducing its size.
4. Runs the command `jupyter lite build` to build the JupyterLab static site, placing the results in `_output/`.
5. Runs `generate_index.py` to overwrite the index file `_output/index.html` with the custom SymPy Live Shell landing page.
6. Adds the file `_output/CNAME` containing `live.sympy.org`.
7. Deploys the contents of `_output` to GitHub pages (`gh-pages` branch hosted at https://live.sympy.org).

The last step (deploy to `gh-pages`) runs only on pushes to the `main` branch.


### Running locally

The local development steps are similar to the production steps,
but you'll run local web server to view the static files in `_output`,
and modify one line in `templates/index.html` to load the iframe from localhost (127.0.0.1):

1. Install Python and dependencies listed in `requirements.txt`
2. Download latest stable SymPy wheel:

   ```bash
    mkdir -p custom_wheels
    python -m pip download sympy --only-binary=:all: --no-deps --dest custom_wheels
   ```

   This wheel will be indexed by JupyterLite via the `jupyter_lite_config.json` file and made available to the Pyodide kernel for the REPL app for installation.
3. Optionally, run `unvendor_tests_from_wheel.py custom_wheels` with a PEP 723 compatible script runner such as `pipx`, `uv`, `hatch`, etc. to remove the tests from the downloaded wheel, reducing its size.
4. Run the command `jupyter lite build` to build the JupyterLab static site, placing the results in `_output/`.
5. Edit [`templates/index.html`](https://github.com/sympy/live/blob/main/templates/index.html#L3)
    to change the value of `host` from `https://www.sympy.org/live` to `http://127.0.0.1:8000`.
6. Run `generate_index.py` with a PEP 723 compatible script runner such as `pipx`, `uv`, `hatch`, etc. to overwrite the index file `_output/index.html` with the custom SymPy Live Shell landing page.
7. Run a local web server in the directory `_output/`. For example, you can run `cd _output/` followed by `python3 -m http.server 8000`.
8. Open `http://127.0.0.1:8000/index.html` in your browser.



### More information

For more info, keep an eye on the JupyterLite documentation:

- Configuring: https://jupyterlite.readthedocs.io/en/stable/quickstart/configure.html
- Deploying to GitHub pages: https://jupyterlite.readthedocs.io/en/stable/quickstart/deploy.html

