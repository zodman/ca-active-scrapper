from fabric import Connection, Config
from patchwork.transfers import rsync
import os


c = Connection(
    host="zodman@mail.local.ts",
)
c.config.run.echo = True
c.config.run.debug = True


BASE_DIR = os.path.basename(os.path.dirname(os.path.realpath(__file__)))

APP_DIR = f"/home/zodman/apps/{BASE_DIR}"

mise = "~/.local/bin/mise"

rsync(
    c,
    ".",
    APP_DIR,
    exclude=[
        ".venv",
        ".git",
        "*.db",
        "output.json",
        "all_output.json",
        "src/node_modules",
        "src/.parcel-cache",
        "src/dist",
        ".devenv",
    ],
)

c.run(f"mkdir -p {APP_DIR}")
with c.cd(APP_DIR):
    c.run(f"{mise} install && {mise} exec -- python -m venv .venv")
    c.run("./.venv/bin/pip install -r requirements.txt")
    c.run("crontab -l > cron.tmp")
    c.run(
        f"echo '*/5 8-23 * * * {APP_DIR}/run.sh 2>&1 | logger -t pickleball  ' > cron.tmp "
    )
    c.run("sort -u cron.tmp > cron")
    c.run("bash run.sh")
    c.run("crontab cron && rm -f cron*")
