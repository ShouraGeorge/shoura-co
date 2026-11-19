#!/usr/bin/env bash
# What Cloudflare Pages runs on every push. Build command: bash build.sh
# Output directory: dist
set -euo pipefail

echo "--- dependencies"
python3 -m pip install --quiet --disable-pip-version-check -r requirements.txt

echo "--- content"
node tools/extract-content.js

echo "--- build"
python3 build.py

echo "--- audit"
python3 audit.py | tee audit-report.txt
grep -q "ERRORS: 0" audit-report.txt || { echo "AUDIT FAILED — deploy stopped"; exit 1; }
rm -f audit-report.txt

echo "--- done"
