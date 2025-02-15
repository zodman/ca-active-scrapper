import json
import requests
from marshmallow import Schema
import timeago
from dateutil.parser import parse
import datetime
import dbm
import os

from rich.console import Console

console = Console()

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


with open(os.path.join(BASE_DIR, "output.json")) as f:
    results = json.loads(f.read())

filtered = []
for i in results:
    r = Schema.from_dict(i)
    filtered.append(r)

now = datetime.datetime.now()


def filter_by_date(x):
    if "to" in x.date_range:
        return parse(x.date_range.split("to")[0])
    return parse(x.date_range)


filtered = sorted(
    filtered,
    key=filter_by_date,
    reverse=True,
)


def send_telegram_message(message):
    token = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        print("no message to telegram")
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    params = {"chat_id": chat_id, "text": message}
    response = requests.get(url, params=params)
    response.raise_for_status()


for i in filtered:
    sent_message = False
    if i.activity_online_start_time:
        d = parse(i.activity_online_start_time)
        two_weeks_later = now + datetime.timedelta(days=14)
        if d >= two_weeks_later:
            continue
        f = timeago.format(d, now)
    else:
        f = ":up: [green][b]NOW[/b][/green]"

        with dbm.open(os.path.join(BASE_DIR, ".mydb"), "c") as db:
            id = f"{i.id}"
            if id not in db:
                db[id] = "send"
                send_mesage = True
    msg = f""" [bold]{i.name}[/bold],  {i.openings} avail,  open: {f}  ages: {i.ages}
            {i.days_of_week}, {timeago.format(parse(i.date_range.split("to")[0]), now) if "to"  in i.date_range else timeago.format(parse(i.date_range), now)}, {i.date_range }, {i.time_range}
            {i.location["label"]}
          {i.detail_url}
        
    """
    console.print(msg)
    if sent_message:
        send_telegram_message(msg)
