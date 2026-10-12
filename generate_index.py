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


def get_sympy_versions():
    """Get stable and development SymPy versions from custom_wheels/."""
    versions = {}
    for wheel in Path("custom_wheels").glob("sympy-*-py3-none-any.whl"):
        match = re.fullmatch(r"sympy-(.+)-py3-none-any\.whl", wheel.name)
        if not match:
            continue

        version = match.group(1)
        channel = "dev" if ".dev" in version else "stable"
        if channel in versions:
            raise RuntimeError(
                f"Expected one {channel} SymPy wheel, found multiple versions"
            )
        versions[channel] = version

    missing = {"stable", "dev"} - versions.keys()
    if missing:
        raise RuntimeError(
            "Missing SymPy wheel(s): " + ", ".join(sorted(missing))
        )
    return versions


env = Environment(loader=FileSystemLoader("templates"), extensions=["jinja2.ext.i18n"])

env.filters["md5"] = md5_filter
env.globals["datetime"] = format_datetime
env.globals["sympy_versions"] = get_sympy_versions()
env.install_null_translations()  # Currently only template is in English; no i18n

# Generate index.html add required static/ files
################################################################################

destdir = "_output"


print("Generating HTML pages from files in templates/")
template = env.get_template("index.html")
for destpath, is_dev in [
    (os.path.join(destdir, "index.html"), False),
    (os.path.join(destdir, "dev", "index.html"), True),
]:
    print("    Processing '%s'" % destpath)
    rendered = template.render(is_dev=is_dev)
    os.makedirs(os.path.dirname(destpath), exist_ok=True)
    if not is_dev:
        shutil.copyfile(destpath, destpath + ".bak")
    with open(destpath, "wb") as f:
        f.write(rendered.encode("utf-8"))
        f.write(b"\n")

print("Copying contents of static/ to destdir", destdir)
staticsrcdir = "./static"
staticdestdir = os.path.join(destdir, "static")
if os.path.exists(staticdestdir):
    shutil.rmtree(staticdestdir)
shutil.copytree(staticsrcdir, staticdestdir)
