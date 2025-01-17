#!/usr/bin/env python3

# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "wheel",
# ]
# ///

import fnmatch
import os
import shutil
import subprocess
import tempfile
from itertools import chain
from pathlib import Path


def unvendor_tests(
    install_prefix: Path,
    test_install_prefix: Path,
    retain_test_patterns: list[str] = [],
) -> int:
    """Unvendor test files and folders from installed package."""
    n_moved = 0
    shutil.rmtree(test_install_prefix, ignore_errors=True)

    for root, _dirs, files in os.walk(install_prefix):
        root_rel = Path(root).relative_to(install_prefix)
        if root_rel.name == "__pycache__" or root_rel.name.endswith(".egg_info"):
            continue

        # 1. handle test directories
        if root_rel.name in ["test", "tests"]:
            (test_install_prefix / root_rel).parent.mkdir(exist_ok=True, parents=True)
            shutil.move(install_prefix / root_rel, test_install_prefix / root_rel)
            n_moved += 1
            continue

        # 2. handle test files
        for fpath in files:
            if (
                fnmatch.fnmatchcase(fpath, "test_*.py")
                or fnmatch.fnmatchcase(fpath, "*_test.py")
                or fpath == "conftest.py"
            ):
                if any(fnmatch.fnmatchcase(fpath, pat) for pat in retain_test_patterns):
                    continue
                (test_install_prefix / root_rel).mkdir(exist_ok=True, parents=True)
                shutil.move(
                    install_prefix / root_rel / fpath,
                    test_install_prefix / root_rel / fpath,
                )
                n_moved += 1

    return n_moved


def process_wheel(
    wheel_path: Path, dest_dir: Path | None = None, retain_test_patterns: list[str] = []
):
    """Process a wheel file to remove test-related files from it. Currently not reproducible, use with caution."""
    source_date_epoch = int(
        os.environ.get("SOURCE_DATE_EPOCH", "315532800")
    )  # 1980-01-01

    print(f"\nProcessing {wheel_path}")
    initial_size = wheel_path.stat().st_size

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)
        unpack_dir = tmpdir_path / "unpacked"
        test_dir = tmpdir_path / "test_files"

        subprocess.check_call(
            [
                sys.executable,
                "-m",
                "wheel",
                "unpack",
                "--dest",
                str(unpack_dir),
                str(wheel_path),
            ]
        )

        unpacked_pkg = next(unpack_dir.iterdir())

        n_moved = unvendor_tests(unpacked_pkg, test_dir, retain_test_patterns)
        print(f"Removed {n_moved} test files/directories")

        # Set timestamps
        for root, dirs, files in os.walk(unpacked_pkg):
            for item in chain(dirs, files):
                os.utime(
                    os.path.join(root, item), (source_date_epoch, source_date_epoch)
                )

        # Determine where to put the output wheel
        output_dir = dest_dir if dest_dir else wheel_path.parent
        output_dir.mkdir(parents=True, exist_ok=True)

        subprocess.check_call(
            [
                sys.executable,
                "-m",
                "wheel",
                "pack",
                "--dest-dir",
                str(tmpdir_path),
                str(unpacked_pkg),
            ],
        )

        packed_wheel = next(tmpdir_path.glob(f"{unpacked_pkg.name}*.whl"))
        output_path = output_dir / wheel_path.name

        if dest_dir:
            shutil.copy2(packed_wheel, output_path)
            print(f"Created wheel file: {output_path}")
        else:
            shutil.move(str(packed_wheel), str(output_path))
            print(f"Updated wheel file: {output_path}")

        final_size = output_path.stat().st_size
        reduction = (initial_size - final_size) / initial_size * 100

        print(f"Size reduction: {initial_size:,} -> {final_size:,} bytes")
        print(f"Reduction percentage: {reduction:.1f}%")


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Remove test files from wheels in a directory"
    )
    parser.add_argument(
        "path", type=Path, help="Path to wheel file or directory containing wheels"
    )
    parser.add_argument(
        "--retain", nargs="*", default=[], help="Patterns of test files to retain"
    )
    parser.add_argument(
        "--dest",
        type=Path,
        help="Destination directory for processed wheels (default: overwrite original)",
    )
    args = parser.parse_args()

    if not args.path.exists():
        print(f"Error: Path {args.path} not found")
        return 1

    try:
        if args.path.is_file():
            if not args.path.name.endswith(".whl"):
                print(f"Error: {args.path} is not a wheel file")
                return 1
            process_wheel(args.path, args.dest, args.retain)
        else:
            wheels = list(args.path.glob("*.whl"))
            if not wheels:
                print(f"No wheel files found in {args.path}")
                return 1
            print(f"Found {len(wheels)} wheel files")
            for wheel in wheels:
                process_wheel(wheel, args.dest, args.retain)
        return 0
    except Exception as e:
        print(f"Error processing wheel(s): {e}")
        return 1


if __name__ == "__main__":
    import sys

    sys.exit(main())
