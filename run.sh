#!/bin/bash
set -eax
REAL_PATH=$(realpath "$0")
APP_DIR=$(dirname "$REAL_PATH")
PATH="$HOME/.local/bin/:$APP_DIR/.venv/bin/:$PATH"
eval $(mise env -C $APP_DIR)
"$APP_DIR"/.venv/bin/python "$APP_DIR"/main.py pickleball
"$APP_DIR"/.venv/bin/python "$APP_DIR"/display.py

"$APP_DIR"/.venv/bin/python "$APP_DIR"/all.py pickleball

cd $APP_DIR/src && mise exec -- npx parcel build
