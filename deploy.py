from fabric import Connection
from patchwork.transfers import rsync
import os

c = Connection(host="zodman@mail.local.ts")


BASE_DIR = os.path.basename(os.path.dirname(os.path.realpath(__file__)))

APP_DIR = f"/home/zodman/apps/{BASE_DIR}"

mise = "~/.local/bin/mise"

rsync(c, ".", APP_DIR, exclude=[".venv", ".git", "*.db", "output.json", "src"])

c.run(f"mkdir -p {APP_DIR}")
with c.cd(APP_DIR):
    c.run(f"{mise} install && {mise} exec -- python -m venv .venv", echo=True)
    c.run("./.venv/bin/pip install -r requirements.txt")
    c.run("crontab -l > cron.tmp")
    c.run(
        f"echo '15,30,45,60 8-23 * * * {APP_DIR}/run.sh 2>&1 | logger -t pickleball  ' > cron.tmp "
    )
    c.run("sort -u cron.tmp > cron")
    c.run("crontab cron && rm -f cron*")
