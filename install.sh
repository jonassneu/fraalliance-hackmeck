#!/bin/sh
# Installs the forecast: the Python environment, the model files of the release and a test forecast.
#   ./install.sh              install and test
#   ./install.sh --service    also run it in the background (Linux, systemd user service)
# Details: SETUP.md
set -eu
cd "$(dirname "$0")"
if ! command -v uv >/dev/null 2>&1; then
    echo "This installer needs uv, the Python package manager (https://docs.astral.sh/uv/). Install it with"
    echo "    curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo "then open a new terminal and run ./install.sh again."
    exit 1
fi
uv sync --frozen --no-dev
exec uv run --no-sync python -m ops.install "$@"
