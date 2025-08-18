#!/usr/bin/env python3

# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "jinja2",
#   "babel",
# ]
# ///

import os
import babel
import babel.dates
import hashlib
import datetime
import shutil
import re
from pathlib import Path

# Setup jinja2
################################################################################
from jinja2 import Environment, FileSystemLoader


def md5_filter(value):
    return hashlib.md5(value).hexdigest()


def format_datetime(year, month, day):
    return babel.dates.format_date(
        datetime.date(year, month, day), locale=env.globals["locale"]
    )


def get_sympy_version():
    """Get SymPy version from wheel file downloaded in the custom_wheels/ directory."""
    wheel = next(Path("custom_wheels").glob("sympy-*-py3-none-any.whl"))
    version = re.match(r"sympy-(.+)-py3-none-any\.whl", wheel.name).group(1)
    return version


env = Environment(loader=FileSystemLoader("templates"), extensions=["jinja2.ext.i18n"])

env.filters["md5"] = md5_filter
env.globals["datetime"] = format_datetime
env.globals["sympy_version"] = get_sympy_version()
env.install_null_translations()  # Currently only template is in English; no i18n

# Generate index.html add required static/ files
################################################################################

destdir = "_output"


print("Generating HTML pages from files in templates/")
templates = ["index.html"]
for template in templates:
    t = env.get_template(template)
    print("    Processing '%s'" % template)
    name = os.path.splitext(template)[0]
    s = t.render()
    # os.makedirs(language, exist_ok=True)
    destpath = os.path.join(destdir, template)
    shutil.copyfile(destpath, destpath + ".bak")  # backup jupyterlite index.html
    with open(destpath, "wb") as f:
        f.write(s.encode("utf-8"))
        f.write(b"\n")

print("Copying contents of static/ to destdir", destdir)
staticsrcdir = "./static"
staticdestdir = os.path.join(destdir, "static")
if os.path.exists(staticdestdir):
    shutil.rmtree(staticdestdir)
shutil.copytree(staticsrcdir, staticdestdir)
