from fabric import Connection
from patchwork.transfers import rsync
import os

c = Connection(host="zodman@100.120.174.80")


BASE_DIR = os.path.basename(os.path.dirname(os.path.realpath(__file__)))

APP_DIR = f"~/apps/{BASE_DIR}"

rsync(c, ".", APP_DIR, exclude=[".venv", ".git"])

c.run(f"mkdir -p {APP_DIR}")
with c.cd(APP_DIR):
    c.run("~/.local/bin/mise install")
