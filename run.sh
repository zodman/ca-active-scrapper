#!/bin/bash
if [ -e '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh' ]; then
  . '/nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh'
fi
set -ea
REAL_PATH=$(realpath "$0")
APP_DIR=$(dirname "$REAL_PATH")
BUILD_TIME=$(date)
PATH="$HOME/.local/bin/:$APP_DIR/.venv/bin/:$PATH"
eval $(mise env -C $APP_DIR)
"$APP_DIR"/.venv/bin/python "$APP_DIR"/main.py pickleball
"$APP_DIR"/.venv/bin/python "$APP_DIR"/display.py

"$APP_DIR"/.venv/bin/python "$APP_DIR"/all.py pickleball

cd $APP_DIR/src && npm run build
