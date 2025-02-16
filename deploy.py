from fabric import Connection
from patchwork.transfers import rsync
import os

c = Connection(host="zodman@100.120.174.80")


BASE_DIR = os.path.basename(os.path.dirname(os.path.realpath(__file__)))

APP_DIR = f"/home/zodman/apps/{BASE_DIR}"

mise = "~/.local/bin/mise"

rsync(c, ".", APP_DIR, exclude=[".venv", ".git", "*.db", "output.json"])

c.run(f"mkdir -p {APP_DIR}")
with c.cd(APP_DIR):
    c.run(f"{mise} install && {mise} exec -- python -m venv .venv", echo=True)
    c.run(f"{mise} exec -- pip install -r requirements.txt ")
    cmd = f"eval $({mise} env) && {APP_DIR}/.venv/bin/python  {APP_DIR}/main.py pickleball && "
    cmd += (
        f"{APP_DIR}/.venv/bin/python {APP_DIR}/display.py 2>&1 | logger -t pickleball"
    )
    c.run(cmd, echo_stdin=True)
    c.run("crontab -l > cron.tmp")
    c.run(f"echo '30 8-23 * * * {cmd}' > cron.tmp ")
    c.run("sort -u cron.tmp > cron")
    c.run("crontab cron && rm -f cron*")
